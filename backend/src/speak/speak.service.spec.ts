import { Test, TestingModule } from '@nestjs/testing';
import { SpeakService } from './speak.service';

describe('SpeakService', () => {
  let service: SpeakService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpeakService],
    }).compile();

    service = module.get<SpeakService>(SpeakService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
