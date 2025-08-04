import {
  Injectable,
  Inject,
  Logger,
  BadGatewayException,
} from '@nestjs/common';
import OpenAI from 'openai';
import { MessageContent } from '@langchain/core/messages';

import { writeFeedbackChain, WriteFeedback } from '../langchain/write-chain';
import { grammarTipChain } from '../langchain/grammar-tip-chain';
import { LanguageLevel } from './dto/write.dto';
import { CacheService } from '../cache/cache.service';

export interface ProcessWriteResult {
  feedback: WriteFeedback;
  tips: MessageContent | null;
}

@Injectable()
export class WriteService {
  private readonly logger = new Logger(WriteService.name);

  constructor(
    @Inject('OPENAI_CLIENT')
    private readonly openai: OpenAI,
    private readonly cacheService: CacheService,
  ) {}

  private generateCacheKey(
    userResponse: string,
    prompt: string,
    languageLevel: string,
  ): string {
    const content = `write-${userResponse}-${prompt}-${languageLevel}`;
    return this.cacheService.generateKey(content);
  }

  async processWriting(
    userResponse: string,
    prompt: string,
    languageLevel: LanguageLevel,
  ): Promise<ProcessWriteResult> {
    const start = Date.now();
    try {
      this.logger.log(`Processing write request for level: ${languageLevel}`);
      this.logger.log(
        `User response length: ${userResponse.length} characters`,
      );

      // Check cache first
      const cacheKey = this.generateCacheKey(
        userResponse,
        prompt,
        languageLevel,
      );
      const cached = this.cacheService.get<ProcessWriteResult>(cacheKey);

      if (cached) {
        this.logger.log('Returning cached write result');
        return cached;
      }

      // Get feedback first to determine if tips are needed
      const feedback = await writeFeedbackChain.invoke({
        userResponse,
        prompt,
        languageLevel,
      });

      // Validate and provide fallback for feedback structure
      const validatedFeedback = this.validateAndFixFeedback(feedback);

      this.logger.log('Feedback validation completed successfully');

      // Only generate tips if scores are low (4 or below) to reduce API calls
      const needsTips =
        validatedFeedback.grammar.score <= 4 ||
        validatedFeedback.vocabulary.score <= 4 ||
        validatedFeedback.structure.score <= 4;

      let tips: MessageContent | null = null;
      if (needsTips) {
        const tipResult = await grammarTipChain.invoke({
          transcript: userResponse,
        });
        tips = tipResult.content;
      }

      const result = { feedback: validatedFeedback, tips };

      // Cache for 30 minutes
      this.cacheService.set(cacheKey, result, 30 * 60 * 1000);

      return result;
    } catch (err) {
      this.logger.error(
        `processWriting failed for input: "${userResponse}"`,
        err,
      );
      throw new BadGatewayException('Failed processing writing');
    } finally {
      this.logger.log(`processWriting completed in ${Date.now() - start}ms`);
    }
  }

  private validateAndFixFeedback(feedback: unknown): WriteFeedback {
    // Provide fallback structure if feedback is invalid
    const fallbackFeedback: WriteFeedback = {
      correctedText: 'Unable to provide corrections at this time.',
      grammar: {
        comment: 'Unable to analyze grammar at this time.',
        score: 5,
      },
      vocabulary: {
        comment: 'Unable to analyze vocabulary at this time.',
        score: 5,
      },
      structure: {
        comment: 'Unable to analyze structure at this time.',
        score: 5,
      },
      improvements: ['Please try submitting your text again.'],
      closingMessage: 'Keep practicing your German writing!',
    };

    if (!feedback || typeof feedback !== 'object') {
      this.logger.warn('Invalid feedback response: not an object');
      return fallbackFeedback;
    }

    const feedbackObj = feedback as Record<string, unknown>;

    // Validate and fix each field
    const result: WriteFeedback = {
      correctedText:
        typeof feedbackObj.correctedText === 'string'
          ? feedbackObj.correctedText
          : fallbackFeedback.correctedText,
      grammar: this.validateScoreObject(
        feedbackObj.grammar,
        fallbackFeedback.grammar,
      ),
      vocabulary: this.validateScoreObject(
        feedbackObj.vocabulary,
        fallbackFeedback.vocabulary,
      ),
      structure: this.validateScoreObject(
        feedbackObj.structure,
        fallbackFeedback.structure,
      ),
      improvements: this.validateImprovements(
        feedbackObj.improvements,
        fallbackFeedback.improvements,
      ),
      closingMessage:
        typeof feedbackObj.closingMessage === 'string'
          ? feedbackObj.closingMessage
          : fallbackFeedback.closingMessage,
    };

    return result;
  }

  private validateImprovements(
    improvements: unknown,
    fallback: string[],
  ): string[] {
    if (!Array.isArray(improvements)) {
      return fallback;
    }

    const validImprovements = improvements.filter(
      (tip): tip is string => typeof tip === 'string',
    );

    return validImprovements.length > 0 ? validImprovements : fallback;
  }

  private validateScoreObject(
    obj: unknown,
    fallback: { comment: string; score: number },
  ): { comment: string; score: number } {
    if (!obj || typeof obj !== 'object') {
      return fallback;
    }

    const scoreObj = obj as Record<string, unknown>;

    return {
      comment:
        typeof scoreObj.comment === 'string'
          ? scoreObj.comment
          : fallback.comment,
      score:
        typeof scoreObj.score === 'number' &&
        scoreObj.score >= 1 &&
        scoreObj.score <= 10
          ? scoreObj.score
          : fallback.score,
    };
  }
}
