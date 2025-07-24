import { IsNotEmpty, IsString } from 'class-validator';

export type LanguageLevel = 'beginner' | 'intermediate' | 'native';

export class WriteRequestDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsString()
  @IsNotEmpty()
  userResponse: string;

  @IsString()
  @IsNotEmpty()
  languageLevel: LanguageLevel;
}
