import { Injectable } from '@nestjs/common';
import { QuestRepository } from './quest.repository';
import { CreateQuestDto } from './dto/create-quest.dto';

@Injectable()
export class QuestService {
  constructor(private readonly questRepository: QuestRepository) {}

  async createQuest(dto: CreateQuestDto, authorId: number) {
    const quest = await this.questRepository.createQuest(dto, authorId);
    return quest;
  }
}
