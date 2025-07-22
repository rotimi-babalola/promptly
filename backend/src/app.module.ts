import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import Redis from 'ioredis';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { SpeakModule } from './speak/speak.module';

import { SupabaseAuthGuard } from './auth/supabase-auth.guard';
import { UserThrottlerGuard } from './auth/user-throttler.guard';

export const MAX_REQUESTS_PER_DAY = 10;
export const THROTTLE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SpeakModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: THROTTLE_TTL,
          limit: MAX_REQUESTS_PER_DAY,
        },
      ],
      storage: new ThrottlerStorageRedisService(
        new Redis({
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
        }),
      ),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: UserThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: SupabaseAuthGuard,
    },
  ],
})
export class AppModule {}
