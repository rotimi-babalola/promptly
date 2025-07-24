import { Controller, Post, UseGuards, Body } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler/dist/throttler.decorator';

import { MAX_REQUESTS_PER_DAY, THROTTLE_TTL } from '../app.module';

import { WriteService } from './write.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { WriteRequestDto } from './dto/write.dto';

@Controller('api/v1/write')
export class WriteController {
  constructor(private readonly writeService: WriteService) {}

  @UseGuards(SupabaseAuthGuard)
  @Throttle({ default: { limit: MAX_REQUESTS_PER_DAY, ttl: THROTTLE_TTL } })
  @Post()
  async handleWriting(@Body() body: WriteRequestDto) {
    return this.writeService.processWriting(
      body.userResponse,
      body.prompt,
      body.languageLevel,
    );
  }
}
