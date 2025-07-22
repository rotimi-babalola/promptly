import { Test, TestingModule } from '@nestjs/testing';
import { SpeakController } from './speak.controller';
import { SpeakService } from './speak.service';
import { SupabaseAuthGuard } from '../auth/supabase-auth.guard';

describe('SpeakController', () => {
  let controller: SpeakController;
  const mockSpeakService = { processAudio: jest.fn() };
  const mockFile = {
    buffer: Buffer.from('audio'),
    originalname: 'test.webm',
  } as Express.Multer.File;
  const dto = { prompt: 'Hello', languageLevel: 'intermediate' as const };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpeakController],
      providers: [{ provide: SpeakService, useValue: mockSpeakService }],
    })
      .overrideGuard(SupabaseAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<SpeakController>(SpeakController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('handleSpeech returns service result', async () => {
    const expected = { transcript: 'T', feedback: {}, tips: [] };
    mockSpeakService.processAudio.mockResolvedValue(expected);
    const result = await controller.handleSpeech(mockFile, dto);
    expect(result).toEqual(expected);
    expect(mockSpeakService.processAudio).toHaveBeenCalledWith(
      mockFile,
      dto.prompt,
      dto.languageLevel,
    );
  });

  it('handleSpeech propagates errors', async () => {
    const error = new Error('Failure');
    mockSpeakService.processAudio.mockRejectedValue(error);
    await expect(controller.handleSpeech(mockFile, dto)).rejects.toThrow(error);
  });
});
