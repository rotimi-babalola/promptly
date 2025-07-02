/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { Express } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import OpenAI from 'openai';
import { ConfigService } from '@nestjs/config/dist/config.service';

import { Feedback, feedbackChain } from '../langchain/speak-chain';
import { grammarTipChain } from 'src/langchain/grammar-tip-chain';
import { MessageContent } from '@langchain/core/messages';

@Injectable()
export class SpeakService {
  private openai: OpenAI;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY') || '';
    if (!apiKey) {
      throw new Error('Missing OPENAI_API_KEY');
    }
    this.openai = new OpenAI({ apiKey });
  }

  async processAudio(file: Express.Multer.File): Promise<{
    transcript: string;
    feedback: Feedback;
    tips: MessageContent | string | null;
  }> {
    const tempDir = path.join(__dirname, '..', '..', 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const buffer = file.buffer;
    if (!buffer) {
      throw new Error('File must be uploaded with Multer.memoryStorage');
    }

    const originalName = file.originalname;

    const tempPath = path.join(tempDir, originalName);

    fs.writeFileSync(tempPath, buffer);

    const transcriptionRes = await this.openai.audio.transcriptions.create({
      file: fs.createReadStream(tempPath),
      model: 'whisper-1',
    });
    const transcript = transcriptionRes.text;

    const feedback = await feedbackChain.invoke({ transcript });

    let tips: MessageContent | string | null = null;

    // If grammar or vocab is weak, get tips
    if (feedback.grammar.score < 4 || feedback.vocabulary.score < 4) {
      const result = await grammarTipChain.invoke({ transcript });
      tips = result.content;
    }

    fs.unlinkSync(tempPath);

    return {
      transcript,
      feedback,
      tips: tips || null,
    };
  }
}
