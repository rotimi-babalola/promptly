import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerModule } from '@nestjs/throttler';
import { BadGatewayException } from '@nestjs/common';
import { WriteController } from './write.controller';
import { WriteService } from './write.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';
import { WriteRequestDto, LanguageLevel } from './dto/write.dto';
import { WriteFeedback } from '../langchain/write-chain';

describe('WriteController', () => {
  let controller: WriteController;
  let writeService: WriteService;

  const mockWriteFeedback: WriteFeedback = {
    correctedText: 'This is the corrected text.',
    grammar: {
      comment: 'Good grammar usage.',
      score: 8,
    },
    vocabulary: {
      comment: 'Rich vocabulary.',
      score: 7,
    },
    structure: {
      comment: 'Well structured text.',
      score: 9,
    },
    improvements: ['Consider using more complex sentences.'],
    closingMessage: 'Keep up the good work!',
  };

  const mockProcessWriteResult = {
    feedback: mockWriteFeedback,
    tips: null,
  };

  beforeEach(async () => {
    const mockWriteService = {
      processWriting: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [WriteController],
      providers: [
        {
          provide: WriteService,
          useValue: mockWriteService,
        },
      ],
      imports: [
        ThrottlerModule.forRoot([
          {
            ttl: 60000,
            limit: 10,
          },
        ]),
      ],
    })
      .overrideGuard(SupabaseAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<WriteController>(WriteController);
    writeService = module.get<WriteService>(WriteService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleWriting', () => {
    it('should successfully handle writing request', async () => {
      // Arrange
      const requestDto: WriteRequestDto = {
        userResponse: 'Das ist ein Test.',
        prompt: 'Write about your day',
        languageLevel: 'intermediate' as LanguageLevel,
      };

      const processWritingSpy = jest
        .spyOn(writeService, 'processWriting')
        .mockResolvedValue(mockProcessWriteResult);

      // Act
      const result = await controller.handleWriting(requestDto);

      // Assert
      expect(result).toEqual(mockProcessWriteResult);
      expect(processWritingSpy).toHaveBeenCalledWith(
        requestDto.userResponse,
        requestDto.prompt,
        requestDto.languageLevel,
      );
      expect(processWritingSpy).toHaveBeenCalledTimes(1);
    });

    it('should handle different language levels', async () => {
      // Arrange
      const languageLevels: LanguageLevel[] = [
        'beginner',
        'intermediate',
        'native',
      ];

      const processWritingSpy = jest
        .spyOn(writeService, 'processWriting')
        .mockResolvedValue(mockProcessWriteResult);

      // Act & Assert
      for (const level of languageLevels) {
        const requestDto: WriteRequestDto = {
          userResponse: 'Test text',
          prompt: 'Test prompt',
          languageLevel: level,
        };

        const result = await controller.handleWriting(requestDto);

        expect(result).toEqual(mockProcessWriteResult);
        expect(processWritingSpy).toHaveBeenCalledWith(
          requestDto.userResponse,
          requestDto.prompt,
          level,
        );
      }

      expect(processWritingSpy).toHaveBeenCalledTimes(3);
    });

    it('should handle empty user response', async () => {
      // Arrange
      const requestDto: WriteRequestDto = {
        userResponse: '',
        prompt: 'Write about your day',
        languageLevel: 'intermediate' as LanguageLevel,
      };

      const processWritingSpy = jest
        .spyOn(writeService, 'processWriting')
        .mockResolvedValue(mockProcessWriteResult);

      // Act
      const result = await controller.handleWriting(requestDto);

      // Assert
      expect(result).toEqual(mockProcessWriteResult);
      expect(processWritingSpy).toHaveBeenCalledWith(
        '',
        requestDto.prompt,
        requestDto.languageLevel,
      );
    });

    it('should handle long user response', async () => {
      // Arrange
      const longText = 'Das ist ein sehr langer Text. '.repeat(100);
      const requestDto: WriteRequestDto = {
        userResponse: longText,
        prompt: 'Write a long essay',
        languageLevel: 'native' as LanguageLevel,
      };

      const processWritingSpy = jest
        .spyOn(writeService, 'processWriting')
        .mockResolvedValue(mockProcessWriteResult);

      // Act
      const result = await controller.handleWriting(requestDto);

      // Assert
      expect(result).toEqual(mockProcessWriteResult);
      expect(processWritingSpy).toHaveBeenCalledWith(
        longText,
        requestDto.prompt,
        requestDto.languageLevel,
      );
    });

    it('should handle special characters in text', async () => {
      // Arrange
      const specialText = 'Hällö wörld! Ümlauts & spëcial châractërs: 123@#$%';
      const requestDto: WriteRequestDto = {
        userResponse: specialText,
        prompt: 'Write with special characters',
        languageLevel: 'intermediate' as LanguageLevel,
      };

      const processWritingSpy = jest
        .spyOn(writeService, 'processWriting')
        .mockResolvedValue(mockProcessWriteResult);

      // Act
      const result = await controller.handleWriting(requestDto);

      // Assert
      expect(result).toEqual(mockProcessWriteResult);
      expect(processWritingSpy).toHaveBeenCalledWith(
        specialText,
        requestDto.prompt,
        requestDto.languageLevel,
      );
    });

    it('should handle result with tips', async () => {
      // Arrange
      const requestDto: WriteRequestDto = {
        userResponse: 'Das ist ein Test.',
        prompt: 'Write about your day',
        languageLevel: 'beginner' as LanguageLevel,
      };

      const resultWithTips = {
        feedback: {
          ...mockWriteFeedback,
          grammar: { comment: 'Needs improvement', score: 3 },
          vocabulary: { comment: 'Limited vocabulary', score: 3 },
        },
        tips: 'Remember to use proper articles in German.',
      };

      jest
        .spyOn(writeService, 'processWriting')
        .mockResolvedValue(resultWithTips);

      // Act
      const result = await controller.handleWriting(requestDto);

      // Assert
      expect(result).toEqual(resultWithTips);
      expect(result.tips).toBe('Remember to use proper articles in German.');
    });

    it('should propagate BadGatewayException from service', async () => {
      // Arrange
      const requestDto: WriteRequestDto = {
        userResponse: 'Das ist ein Test.',
        prompt: 'Write about your day',
        languageLevel: 'intermediate' as LanguageLevel,
      };

      jest
        .spyOn(writeService, 'processWriting')
        .mockRejectedValue(
          new BadGatewayException('Failed processing writing'),
        );

      // Act & Assert
      await expect(controller.handleWriting(requestDto)).rejects.toThrow(
        BadGatewayException,
      );
      await expect(controller.handleWriting(requestDto)).rejects.toThrow(
        'Failed processing writing',
      );
    });

    it('should propagate other errors from service', async () => {
      // Arrange
      const requestDto: WriteRequestDto = {
        userResponse: 'Das ist ein Test.',
        prompt: 'Write about your day',
        languageLevel: 'intermediate' as LanguageLevel,
      };

      jest
        .spyOn(writeService, 'processWriting')
        .mockRejectedValue(new Error('Unexpected error'));

      // Act & Assert
      await expect(controller.handleWriting(requestDto)).rejects.toThrow(
        'Unexpected error',
      );
    });

    it('should handle various prompt types', async () => {
      // Arrange
      const prompts = [
        'Write about your day',
        'Describe your favorite hobby',
        'Tell me about your family',
        'What did you do last weekend?',
        'Explain your future plans',
      ];

      const processWritingSpy = jest
        .spyOn(writeService, 'processWriting')
        .mockResolvedValue(mockProcessWriteResult);

      // Act & Assert
      for (const prompt of prompts) {
        const requestDto: WriteRequestDto = {
          userResponse: 'Test response',
          prompt,
          languageLevel: 'intermediate' as LanguageLevel,
        };

        const result = await controller.handleWriting(requestDto);

        expect(result).toEqual(mockProcessWriteResult);
        expect(processWritingSpy).toHaveBeenCalledWith(
          'Test response',
          prompt,
          'intermediate',
        );
      }

      expect(processWritingSpy).toHaveBeenCalledTimes(prompts.length);
    });
  });
});
