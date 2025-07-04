import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { SpeakService } from './speak.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { memoryStorage } from 'multer';

@Controller('api/v1/speak')
export class SpeakController {
  constructor(private readonly speakService: SpeakService) {}

  @UseGuards(SupabaseAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async handleSpeech(
    @UploadedFile() file: Express.Multer.File,
    @Body() prompt: string,
  ) {
    const feedback = await this.speakService.processAudio(file, prompt);
    return { feedback };
  }
}
