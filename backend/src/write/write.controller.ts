import { Controller, Post, UseGuards, Body } from '@nestjs/common';

import { WriteService } from './write.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { WriteRequestDto } from './dto/write.dto';

@Controller('api/v1/write')
export class WriteController {
  constructor(private readonly writeService: WriteService) {}

  @UseGuards(SupabaseAuthGuard)
  @Post()
  async handleWriting(@Body() body: WriteRequestDto) {
    return this.writeService.processWriting(
      body.userResponse,
      body.prompt,
      body.languageLevel,
    );
  }
}
