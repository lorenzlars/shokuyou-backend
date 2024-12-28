import { Test, TestingModule } from '@nestjs/testing';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';

describe('RecipesController', () => {
  let controller: RecipesController;

  const mockRecipesService = {
    addRecipe: jest.fn((dto) => ({ id: '1', ...dto })),
    getRecipe: jest.fn((id) => ({
      id,
      name: 'Test Recipe',
      description: 'Test Description',
    })),
    findAll: jest.fn(() => [
      { id: '1', name: 'Test Recipe', description: 'Test Description' },
      { id: '2', name: 'Another Recipe', description: 'Another Description' },
    ]),
    updateRecipe: jest.fn((id, dto) => ({ id, ...dto })),
    removeRecipe: jest.fn((id) => ({ id })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecipesController],
      providers: [
        {
          provide: RecipesService,
          useValue: mockRecipesService,
        },
      ],
    }).compile();

    controller = module.get<RecipesController>(RecipesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a recipe', async () => {
    const recipe = await controller.getRecipe('1');
    expect(recipe).toBeDefined();
    expect(recipe).toEqual({
      id: '1',
      name: 'Test Recipe',
      description: 'Test Description',
    });
  });
});
