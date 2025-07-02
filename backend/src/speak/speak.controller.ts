import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { SpeakService } from './speak.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

@Controller('api/v1/speak')
export class SpeakController {
  constructor(private readonly speakService: SpeakService) {}

  @UseGuards(SupabaseAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('audio'))
  async handleSpeech(@UploadedFile() file: Express.Multer.File) {
    const feedback = await this.speakService.processAudio(file);
    return { feedback };
  }
}
