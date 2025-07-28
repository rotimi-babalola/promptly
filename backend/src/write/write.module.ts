import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

import { WriteController } from './write.controller';
import { WriteService } from './write.service';

@Module({
  controllers: [WriteController],
  providers: [
    WriteService,
    {
      provide: 'OPENAI_CLIENT',
      useFactory: (configService: ConfigService) => {
        const apiKey = configService.get<string>('OPENAI_API_KEY');
        if (!apiKey) {
          throw new Error('Missing OPENAI_API_KEY');
        }
        return new OpenAI({ apiKey });
      },
      inject: [ConfigService],
    },
  ],
})
export class WriteModule {}
