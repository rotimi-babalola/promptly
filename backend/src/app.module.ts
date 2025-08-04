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
import { WriteModule } from './write/write.module';

export const MAX_REQUESTS_PER_DAY = 10;
export const THROTTLE_TTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const isTest = !!process.env.JEST_WORKER_ID;
const redisClient = !isTest
  ? new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379')
  : null;

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
      ...(redisClient
        ? { storage: new ThrottlerStorageRedisService(redisClient) }
        : {}),
    }),
    WriteModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: SupabaseAuthGuard },
    { provide: APP_GUARD, useClass: UserThrottlerGuard },
  ],
})
export class AppModule {}
