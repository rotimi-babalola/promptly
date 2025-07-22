import { Test, TestingModule } from '@nestjs/testing';
import { SpeakController } from './speak.controller';

describe('SpeakController', () => {
  let controller: SpeakController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpeakController],
    }).compile();

    controller = module.get<SpeakController>(SpeakController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
