import { Test, TestingModule } from '@nestjs/testing';
import { InstantService } from './instant.service';

describe('InstantService', () => {
  let service: InstantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InstantService],
    }).compile();

    service = module.get<InstantService>(InstantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
