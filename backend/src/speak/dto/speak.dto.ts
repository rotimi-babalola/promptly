import { IsNotEmpty, IsString } from 'class-validator';

export type LanguageLevel = 'beginner' | 'intermediate' | 'native';

export class SpeakRequestDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;
  @IsString()
  @IsNotEmpty()
  languageLevel: LanguageLevel;
}
