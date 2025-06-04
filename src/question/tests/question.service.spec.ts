/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from '../question.service';
import { QuestionRepository } from '../question.repository';
import { CreateQuestionDto } from '../dto/create-question.dto';

describe('QuestionService', () => {
  let service: QuestionService;
  let questionRepository: { createQuestion: jest.Mock };

  beforeEach(async () => {
    questionRepository = {
      createQuestion: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        { provide: QuestionRepository, useValue: questionRepository },
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call questionRepository.createQuestion with dto and imageUrl', async () => {
      const dto: CreateQuestionDto = { text: 'Q', options: [1, 2] } as any;
      const imageUrl = 'img.png';
      const created = { id: 1, ...dto, imageUrl };
      questionRepository.createQuestion.mockResolvedValue(created);

      const result = await service.create(dto, imageUrl);

      expect(questionRepository.createQuestion).toHaveBeenCalledWith(
        dto,
        imageUrl,
      );
      expect(result).toEqual(created);
    });

    it('should call questionRepository.createQuestion with undefined imageUrl', async () => {
      const dto: CreateQuestionDto = { text: 'Q', options: [1, 2] } as any;
      const created = { id: 2, ...dto };
      questionRepository.createQuestion.mockResolvedValue(created);

      const result = await service.create(dto);

      expect(questionRepository.createQuestion).toHaveBeenCalledWith(
        dto,
        undefined,
      );
      expect(result).toEqual(created);
    });
  });
});
