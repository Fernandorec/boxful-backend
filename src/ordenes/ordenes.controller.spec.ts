import { Test, TestingModule } from '@nestjs/testing';
import { OrdenesController } from './ordenes.controller';

describe('OrdenesController', () => {
  let controller: OrdenesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdenesController],
    }).compile();

    controller = module.get<OrdenesController>(OrdenesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
