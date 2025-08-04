import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

import { WriteController } from './write.controller';
import { WriteService } from './write.service';
import { CacheService } from '../cache/cache.service';

@Module({
  controllers: [WriteController],
  providers: [
    WriteService,
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
export class WriteModule {}
