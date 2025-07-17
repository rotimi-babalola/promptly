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
import { Throttle } from '@nestjs/throttler/dist/throttler.decorator';
import { memoryStorage } from 'multer';

import { MAX_REQUESTS_PER_DAY, THROTTLE_TTL } from 'src/app.module';

import { SpeakService } from './speak.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { SpeakRequestDto } from './dto/speak.dto';

const MAX_FILE_SIZE = 15 * 1024 * 1024;

@Controller('api/v1/speak')
export class SpeakController {
  constructor(private readonly speakService: SpeakService) {}

  @UseGuards(SupabaseAuthGuard)
  @Throttle({ default: { limit: MAX_REQUESTS_PER_DAY, ttl: THROTTLE_TTL } })
  @Post()
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async handleSpeech(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
          new FileTypeValidator({ fileType: '.(webm)' }),
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
