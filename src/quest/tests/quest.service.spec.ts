/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { QuestService } from '../quest.service';
import { QuestRepository } from '../quest.repository';
import { CreateQuestDto } from '../dto/create-quest.dto';

describe('QuestService', () => {
  let service: QuestService;
  let questRepository: { createQuest: jest.Mock };

  beforeEach(async () => {
    questRepository = {
      createQuest: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestService,
        { provide: QuestRepository, useValue: questRepository },
      ],
    }).compile();

    service = module.get<QuestService>(QuestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createQuest', () => {
    it('should call questRepository.createQuest with dto and authorId and return quest', async () => {
      const dto: CreateQuestDto = { title: 'Test', description: 'Desc' } as any;
      const authorId = 7;
      const quest = { id: 1, ...dto, authorId };
      questRepository.createQuest.mockResolvedValue(quest);

      const result = await service.createQuest(dto, authorId);

      expect(questRepository.createQuest).toHaveBeenCalledWith(dto, authorId);
      expect(result).toEqual(quest);
    });
  });
});
