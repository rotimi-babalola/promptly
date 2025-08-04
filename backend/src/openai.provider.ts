import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

export const OpenAIProvider = {
  provide: 'OPENAI_CLIENT',
  useFactory: (cfg: ConfigService) =>
    new OpenAI({
      apiKey: cfg.get('OPENAI_API_KEY'),
      timeout: 30000,
      maxRetries: 1,
    }),
  inject: [ConfigService],
};
