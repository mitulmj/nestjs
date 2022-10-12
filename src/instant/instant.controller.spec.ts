import { Test, TestingModule } from '@nestjs/testing';
import { InstantController } from './instant.controller';

describe('InstantController', () => {
  let controller: InstantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InstantController],
    }).compile();

    controller = module.get<InstantController>(InstantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
