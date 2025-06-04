/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { QuestController } from '../quest.controller';
import { QuestService } from '../quest.service';
import { CreateQuestDto } from '../dto/create-quest.dto';

describe('QuestController', () => {
  let controller: QuestController;
  let questService: { createQuest: jest.Mock };

  beforeEach(async () => {
    questService = {
      createQuest: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestController],
      providers: [{ provide: QuestService, useValue: questService }],
    }).compile();

    controller = module.get<QuestController>(QuestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call questService.createQuest with dto and user_id and return quest', async () => {
      const dto: CreateQuestDto = { title: 'Test', description: 'Desc' } as any;
      const user_id = 42;
      const quest = { id: 1, ...dto, user_id };
      questService.createQuest.mockResolvedValue(quest);

      const result = await controller.create(dto, user_id);

      expect(questService.createQuest).toHaveBeenCalledWith(dto, user_id);
      expect(result).toEqual(quest);
    });
  });
});
