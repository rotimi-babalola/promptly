import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Body,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { SpeakService } from './speak.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { SpeakRequestDto } from './dto/speak.dto';

const MAX_FILE_SIZE = 15 * 1024 * 1024;

@Controller('api/v1/speak')
export class SpeakController {
  constructor(private readonly speakService: SpeakService) {}

  @UseGuards(SupabaseAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async handleSpeech(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
          // Accept common audio containers across browsers
          // Chrome/Edge: webm, Firefox: ogg, Safari: mp4/m4a, fallback: wav
          new FileTypeValidator({ fileType: '.(webm|ogg|mp4|m4a|wav)' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() body: SpeakRequestDto,
  ) {
    return this.speakService.processAudio(
      file,
      body.prompt,
      body.languageLevel,
    );
  }
}
