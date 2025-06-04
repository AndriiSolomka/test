import { Injectable } from '@nestjs/common';
import { QuestionRepository } from './question.repository';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionService {
  constructor(private readonly questionRepository: QuestionRepository) {}

  async create(dto: CreateQuestionDto, imageUrl?: string) {
    return this.questionRepository.createQuestion(dto, imageUrl);
  }
}
