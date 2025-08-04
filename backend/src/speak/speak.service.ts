import {
  Injectable,
  Inject,
  Logger,
  BadRequestException,
  BadGatewayException,
} from '@nestjs/common';
import { createReadStream, promises as fs } from 'fs';
import * as path from 'path';
import { file as tmpFile } from 'tmp-promise';
import OpenAI from 'openai';
import { MessageContent } from '@langchain/core/messages';

import { grammarTipChain } from '../langchain/grammar-tip-chain';
import { feedbackChain, Feedback } from '../langchain/speak-chain';
import { LanguageLevel } from './dto/speak.dto';
import { CacheService } from '../cache/cache.service';

export interface ProcessAudioResult {
  transcript: string;
  feedback: Feedback;
  tips: MessageContent | null;
}

@Injectable()
export class SpeakService {
  private readonly logger = new Logger(SpeakService.name);

  constructor(
    @Inject('OPENAI_CLIENT')
    private readonly openai: OpenAI,
    private readonly cacheService: CacheService,
  ) {}

  private generateCacheKey(
    transcript: string,
    prompt: string,
    languageLevel: string,
  ): string {
    const content = `speak-${transcript}-${prompt}-${languageLevel}`;
    return this.cacheService.generateKey(content);
  }

  async processAudio(
    file: Express.Multer.File,
    prompt: string,
    languageLevel: LanguageLevel,
  ): Promise<ProcessAudioResult> {
    if (!file.buffer) {
      throw new BadRequestException(
        'Audio file is required and must use memoryStorage',
      );
    }

    const { path: tempPath, cleanup } = await tmpFile({
      postfix: path.extname(file.originalname),
    });

    const start = Date.now();
    try {
      await fs.writeFile(tempPath, file.buffer);

      const readStream = createReadStream(tempPath);
      const transcriptionRes = await this.openai.audio.transcriptions.create({
        file: readStream,
        model: 'whisper-1',
      });
      readStream.destroy();
      const transcript = transcriptionRes.text;

      // Check cache first
      const cacheKey = this.generateCacheKey(transcript, prompt, languageLevel);
      const cached = this.cacheService.get<ProcessAudioResult>(cacheKey);

      if (cached) {
        this.logger.log('Returning cached speak result');
        return cached;
      }

      // Get feedback first to determine if tips are needed
      const feedback = await feedbackChain.invoke({
        transcript,
        prompt,
        languageLevel,
      });

      // Only generate tips if scores are low (4 or below) to reduce API calls
      const needsTips =
        feedback.grammar.score <= 4 ||
        feedback.vocabulary.score <= 4 ||
        feedback.fluency.score <= 4;

      let tips: MessageContent | null = null;
      if (needsTips) {
        const tipResult = await grammarTipChain.invoke({ transcript });
        tips = tipResult.content;
      }

      const result = { transcript, feedback, tips };

      // Cache for 30 minutes
      this.cacheService.set(cacheKey, result, 30 * 60 * 1000);

      return result;
    } catch (err) {
      this.logger.error(`processAudio failed for ${file.originalname}`, err);
      throw new BadGatewayException('Failed processing audio');
    } finally {
      await cleanup();
      this.logger.log(`processAudio completed in ${Date.now() - start}ms`);
    }
  }
}
