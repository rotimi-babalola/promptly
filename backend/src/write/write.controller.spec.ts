import { Test, TestingModule } from '@nestjs/testing';
import { WriteController } from './write.controller';

describe('WriteController', () => {
  let controller: WriteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WriteController],
    }).compile();

    controller = module.get<WriteController>(WriteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
