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
  ) {}

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

      const [feedback, tipResult] = await Promise.all([
        feedbackChain.invoke({ transcript, prompt, languageLevel }),
        grammarTipChain.invoke({ transcript }),
      ]);

      const tips =
        feedback.grammar.score < 4 || feedback.vocabulary.score < 4
          ? tipResult.content
          : null;

      return { transcript, feedback, tips };
    } catch (err) {
      this.logger.error(`processAudio failed for ${file.originalname}`, err);
      throw new BadGatewayException('Failed processing audio');
    } finally {
      await cleanup();
      this.logger.log(`processAudio completed in ${Date.now() - start}ms`);
    }
  }
}
