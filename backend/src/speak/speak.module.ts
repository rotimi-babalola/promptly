import { Module } from '@nestjs/common';
import { SpeakController } from './speak.controller';
import { SpeakService } from './speak.service';

@Module({
  controllers: [SpeakController],
  providers: [SpeakService],
})
export class SpeakModule {}
