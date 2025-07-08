import { IsNotEmpty, IsString } from 'class-validator';

export class SpeakRequestDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;
}
