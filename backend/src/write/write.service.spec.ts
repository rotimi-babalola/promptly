/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { BadGatewayException } from '@nestjs/common';
import { WriteService, ProcessWriteResult } from './write.service';
import { LanguageLevel } from './dto/write.dto';
import { WriteFeedback } from '../langchain/write-chain';
import { writeFeedbackChain } from '../langchain/write-chain';
import { grammarTipChain } from '../langchain/grammar-tip-chain';
import { CacheService } from '../cache/cache.service';

// Mock the langchain modules
jest.mock('../langchain/write-chain', () => ({
  writeFeedbackChain: {
    invoke: jest.fn(),
  },
  WriteFeedback: {},
}));

jest.mock('../langchain/grammar-tip-chain', () => ({
  grammarTipChain: {
    invoke: jest.fn(),
  },
}));

// Get typed mock functions
const mockWriteFeedbackChain = jest.mocked(writeFeedbackChain);
const mockGrammarTipChain = jest.mocked(grammarTipChain);

describe('WriteService', () => {
  let service: WriteService;
  let mockOpenAI: any;

  const mockValidFeedback: WriteFeedback = {
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

  beforeEach(async () => {
    mockOpenAI = {
      chat: {
        completions: {
          create: jest.fn(),
        },
      },
    };

    const mockCacheService = {
      generateKey: jest.fn().mockReturnValue('test-cache-key'),
      get: jest.fn().mockReturnValue(null),
      set: jest.fn(),
      delete: jest.fn(),
      clear: jest.fn(),
      getStats: jest.fn().mockReturnValue({ size: 0, keys: [] }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WriteService,
        {
          provide: 'OPENAI_CLIENT',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          useValue: mockOpenAI,
        },
        { provide: CacheService, useValue: mockCacheService },
      ],
    }).compile();

    service = module.get<WriteService>(WriteService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processWriting', () => {
    it('should successfully process writing with valid feedback', async () => {
      // Arrange
      const userResponse = 'Das ist ein Test.';
      const prompt = 'Write about your day';
      const languageLevel: LanguageLevel = 'intermediate';

      (mockWriteFeedbackChain.invoke as jest.Mock).mockResolvedValue(
        mockValidFeedback,
      );
      (mockGrammarTipChain.invoke as jest.Mock).mockResolvedValue({
        content: 'Consider using articles more carefully.',
      });

      // Act
      const result: ProcessWriteResult = await service.processWriting(
        userResponse,
        prompt,
        languageLevel,
      );

      // Assert
      expect(result).toBeDefined();
      expect(result.feedback).toEqual(mockValidFeedback);
      expect(result.tips).toBeNull(); // Tips should be null since scores are >= 4

      const mockWriteFeedbackChainInvoke =
        mockWriteFeedbackChain.invoke as jest.Mock;

      expect(mockWriteFeedbackChainInvoke).toHaveBeenCalledWith({
        userResponse,
        prompt,
        languageLevel,
      });
    });

    it('should return tips when grammar or vocabulary score is low', async () => {
      // Arrange
      const userResponse = 'Das ist ein Test.';
      const prompt = 'Write about your day';
      const languageLevel: LanguageLevel = 'beginner';

      const lowScoreFeedback: WriteFeedback = {
        ...mockValidFeedback,
        grammar: { comment: 'Needs improvement', score: 3 },
        vocabulary: { comment: 'Limited vocabulary', score: 3 },
      };

      const tipContent = 'Remember to use proper articles.';

      (mockWriteFeedbackChain.invoke as jest.Mock).mockResolvedValue(
        lowScoreFeedback,
      );
      (mockGrammarTipChain.invoke as jest.Mock).mockResolvedValue({
        content: tipContent,
      });

      // Act
      const result: ProcessWriteResult = await service.processWriting(
        userResponse,
        prompt,
        languageLevel,
      );

      // Assert
      expect(result.feedback).toEqual(lowScoreFeedback);
      expect(result.tips).toBe(tipContent);
    });

    it('should handle invalid feedback and return fallback', async () => {
      // Arrange
      const userResponse = 'Das ist ein Test.';
      const prompt = 'Write about your day';
      const languageLevel: LanguageLevel = 'intermediate';

      (mockWriteFeedbackChain.invoke as jest.Mock).mockResolvedValue(null);
      (mockGrammarTipChain.invoke as jest.Mock).mockResolvedValue({
        content: 'Some tip',
      });

      // Act
      const result: ProcessWriteResult = await service.processWriting(
        userResponse,
        prompt,
        languageLevel,
      );

      // Assert
      expect(result.feedback.correctedText).toBe(
        'Unable to provide corrections at this time.',
      );
      expect(result.feedback.grammar.score).toBe(5);
      expect(result.feedback.vocabulary.score).toBe(5);
      expect(result.feedback.structure.score).toBe(5);
      expect(result.tips).toBeNull();
    });

    it('should handle partial invalid feedback and fix missing fields', async () => {
      // Arrange
      const userResponse = 'Das ist ein Test.';
      const prompt = 'Write about your day';
      const languageLevel: LanguageLevel = 'intermediate';

      const partialFeedback = {
        correctedText: 'Corrected text',
        grammar: { comment: 'Good', score: 8 },
        vocabulary: null, // Invalid
        structure: { comment: 'Good structure', score: 'invalid' }, // Invalid score
        improvements: 'not an array', // Invalid
        closingMessage: 'Good job!',
      };

      (mockWriteFeedbackChain.invoke as jest.Mock).mockResolvedValue(
        partialFeedback,
      );
      (mockGrammarTipChain.invoke as jest.Mock).mockResolvedValue({
        content: 'Some tip',
      });

      // Act
      const result: ProcessWriteResult = await service.processWriting(
        userResponse,
        prompt,
        languageLevel,
      );

      // Assert
      expect(result.feedback.correctedText).toBe('Corrected text');
      expect(result.feedback.grammar).toEqual({ comment: 'Good', score: 8 });
      expect(result.feedback.vocabulary).toEqual({
        comment: 'Unable to analyze vocabulary at this time.',
        score: 5,
      });
      expect(result.feedback.structure).toEqual({
        comment: 'Good structure',
        score: 5, // Fallback score
      });
      expect(result.feedback.improvements).toEqual([
        'Please try submitting your text again.',
      ]);
      expect(result.feedback.closingMessage).toBe('Good job!');
    });

    it('should throw BadGatewayException when langchain fails', async () => {
      // Arrange
      const userResponse = 'Das ist ein Test.';
      const prompt = 'Write about your day';
      const languageLevel: LanguageLevel = 'intermediate';

      (mockWriteFeedbackChain.invoke as jest.Mock).mockRejectedValue(
        new Error('AI service error'),
      );

      // Act & Assert
      await expect(
        service.processWriting(userResponse, prompt, languageLevel),
      ).rejects.toThrow(BadGatewayException);
      await expect(
        service.processWriting(userResponse, prompt, languageLevel),
      ).rejects.toThrow('Failed processing writing');
    });

    it('should handle empty or undefined user response', async () => {
      // Arrange
      const userResponse = '';
      const prompt = 'Write about your day';
      const languageLevel: LanguageLevel = 'intermediate';

      (mockWriteFeedbackChain.invoke as jest.Mock).mockResolvedValue(
        mockValidFeedback,
      );
      (mockGrammarTipChain.invoke as jest.Mock).mockResolvedValue({
        content: 'Some tip',
      });

      // Act
      const result: ProcessWriteResult = await service.processWriting(
        userResponse,
        prompt,
        languageLevel,
      );

      // Assert
      expect(result).toBeDefined();
      expect(mockWriteFeedbackChain.invoke as jest.Mock).toHaveBeenCalledWith({
        userResponse: '',
        prompt,
        languageLevel,
      });
    });

    it('should handle different language levels correctly', async () => {
      // Arrange
      const userResponse = 'Das ist ein Test.';
      const prompt = 'Write about your day';

      (mockWriteFeedbackChain.invoke as jest.Mock).mockResolvedValue(
        mockValidFeedback,
      );
      (mockGrammarTipChain.invoke as jest.Mock).mockResolvedValue({
        content: 'Some tip',
      });

      // Test all language levels
      const levels: LanguageLevel[] = ['beginner', 'intermediate', 'native'];

      for (const level of levels) {
        // Act
        await service.processWriting(userResponse, prompt, level);

        // Assert
        expect(mockWriteFeedbackChain.invoke as jest.Mock).toHaveBeenCalledWith(
          {
            userResponse,
            prompt,
            languageLevel: level,
          },
        );
      }

      expect(mockWriteFeedbackChain.invoke as jest.Mock).toHaveBeenCalledTimes(
        3,
      );
    });
  });

  describe('validateAndFixFeedback', () => {
    // Since this is a private method, we test it indirectly through processWriting
    it('should handle feedback with invalid score ranges', async () => {
      // Arrange
      const userResponse = 'Test';
      const prompt = 'Write something';
      const languageLevel: LanguageLevel = 'intermediate';

      const invalidScoreFeedback = {
        correctedText: 'Corrected',
        grammar: { comment: 'Good', score: 15 }, // Invalid: > 10
        vocabulary: { comment: 'Good', score: -1 }, // Invalid: < 1
        structure: { comment: 'Good', score: 7 },
        improvements: ['Good tip'],
        closingMessage: 'Well done!',
      };

      (mockWriteFeedbackChain.invoke as jest.Mock).mockResolvedValue(
        invalidScoreFeedback,
      );
      (mockGrammarTipChain.invoke as jest.Mock).mockResolvedValue({
        content: 'Some tip',
      });

      // Act
      const result = await service.processWriting(
        userResponse,
        prompt,
        languageLevel,
      );

      // Assert
      expect(result.feedback.grammar.score).toBe(5); // Should use fallback
      expect(result.feedback.vocabulary.score).toBe(5); // Should use fallback
      expect(result.feedback.structure.score).toBe(7); // Should keep valid score
    });
  });
});
