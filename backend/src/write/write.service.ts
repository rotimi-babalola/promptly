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
  ) {}

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

      const [feedback, tipResult] = await Promise.all([
        writeFeedbackChain.invoke({ userResponse, prompt, languageLevel }),
        grammarTipChain.invoke({ transcript: userResponse }),
      ]);

      // Log the raw feedback structure for debugging
      this.logger.debug(
        'Raw feedback from AI:',
        JSON.stringify(feedback, null, 2),
      );

      // Validate and provide fallback for feedback structure
      const validatedFeedback = this.validateAndFixFeedback(feedback);

      this.logger.log('Feedback validation completed successfully');

      const tips =
        validatedFeedback.grammar.score < 4 ||
        validatedFeedback.vocabulary.score < 4
          ? tipResult.content
          : null;

      return { feedback: validatedFeedback, tips };
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
