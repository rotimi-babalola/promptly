import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpeakModule } from './speak/speak.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), SpeakModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
