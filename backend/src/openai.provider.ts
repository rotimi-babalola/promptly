import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

export const OpenAIProvider = {
  provide: 'OPENAI_CLIENT',
  useFactory: (cfg: ConfigService) =>
    new OpenAI({ apiKey: cfg.get('OPENAI_API_KEY') }),
  inject: [ConfigService],
};
