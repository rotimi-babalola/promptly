/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, BadGatewayException } from '@nestjs/common';
import * as tmp from 'tmp-promise';

import { SpeakService } from './speak.service';
import { Feedback } from '../langchain/speak-chain';
import { grammarTipChain } from '../langchain/grammar-tip-chain';
import { feedbackChain } from '../langchain/speak-chain';
import { CacheService } from '../cache/cache.service';

jest.mock('tmp-promise');
jest.mock('../langchain/grammar-tip-chain', () => ({
  grammarTipChain: { invoke: jest.fn() },
}));
jest.mock('../langchain/speak-chain', () => ({
  feedbackChain: { invoke: jest.fn() },
}));

describe('SpeakService', () => {
  let service: SpeakService;

  const mockOpenAI: any = {
    audio: {
      transcriptions: {
        create: jest.fn(),
      },
    },
  };

  const mockFile = {
    buffer: Buffer.from('audio'),
    originalname: 'file.webm',
  } as Express.Multer.File;

  const prompt = 'Test prompt';
  const level = 'beginner' as const;
  const transcript = 'result text';

  const lowFeedback: Feedback = {
    fluency: { comment: 'ok', score: 2 },
    grammar: { comment: 'ok', score: 2 },
    vocabulary: { comment: 'ok', score: 2 },
    pronunciation: { comment: 'ok', score: 2 },
    closingMessage: 'done',
  };

  const highFeedback: Feedback = {
    fluency: { comment: 'good', score: 5 },
    grammar: { comment: 'good', score: 5 },
    vocabulary: { comment: 'good', score: 5 },
    pronunciation: { comment: 'good', score: 5 },
    closingMessage: 'done',
  };

  const tips = [{ text: 'tip' }];

  const mockCacheService = {
    generateKey: jest.fn().mockReturnValue('test-cache-key'),
    get: jest.fn().mockReturnValue(null),
    set: jest.fn(),
    delete: jest.fn(),
    clear: jest.fn(),
    getStats: jest.fn().mockReturnValue({ size: 0, keys: [] }),
  };

  beforeEach(async () => {
    (tmp.file as jest.Mock).mockResolvedValue({
      path: 'tmp.webm',
      cleanup: jest.fn(),
    });
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpeakService,
        { provide: 'OPENAI_CLIENT', useValue: mockOpenAI },
        { provide: CacheService, useValue: mockCacheService },
      ],
    }).compile();
    service = module.get<SpeakService>(SpeakService);
  });

  it('returns transcript, feedback, tips when scores low', async () => {
    (mockOpenAI.audio.transcriptions.create as jest.Mock).mockResolvedValue({
      text: transcript,
    });
    (feedbackChain.invoke as jest.Mock).mockResolvedValue(lowFeedback);
    (grammarTipChain.invoke as jest.Mock).mockResolvedValue({ content: tips });

    const result = await service.processAudio(mockFile, prompt, level);
    expect(result).toEqual({ transcript, feedback: lowFeedback, tips });
  });

  it('returns null tips when scores high', async () => {
    (mockOpenAI.audio.transcriptions.create as jest.Mock).mockResolvedValue({
      text: transcript,
    });
    (feedbackChain.invoke as jest.Mock).mockResolvedValue(highFeedback);
    (grammarTipChain.invoke as jest.Mock).mockResolvedValue({ content: tips });

    const result = await service.processAudio(mockFile, prompt, level);
    expect(result).toEqual({ transcript, feedback: highFeedback, tips: null });
  });

  it('throws BadRequestException without buffer', async () => {
    const invalid = { originalname: 'x.webm' } as Express.Multer.File;
    await expect(service.processAudio(invalid, prompt, level)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('throws BadGatewayException on transcription error', async () => {
    (mockOpenAI.audio.transcriptions.create as jest.Mock).mockRejectedValue(
      new Error('fail'),
    );
    try {
      await service.processAudio(mockFile, prompt, level);
      fail('Expected BadGatewayException to be thrown');
    } catch (error) {
      console.log('Caught error:', error);
      expect(error.name).toBe('BadGatewayException');
      expect(error.message).toBe('Failed processing audio');
    }
  });
});
