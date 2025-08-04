import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

import { SpeakController } from './speak.controller';
import { SpeakService } from './speak.service';
import { CacheService } from '../cache/cache.service';

@Module({
  controllers: [SpeakController],
  providers: [
    SpeakService,
    CacheService,
    {
      provide: 'OPENAI_CLIENT',
      useFactory: (configService: ConfigService) => {
        const apiKey = configService.get<string>('OPENAI_API_KEY');
        if (!apiKey) {
          throw new Error('Missing OPENAI_API_KEY');
        }
        return new OpenAI({
          apiKey,
          timeout: 30000,
          maxRetries: 1,
        });
      },
      inject: [ConfigService],
    },
  ],
})
export class SpeakModule {}
