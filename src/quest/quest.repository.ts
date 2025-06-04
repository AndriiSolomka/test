import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestDto } from './dto/create-quest.dto';

@Injectable()
export class QuestRepository {
  constructor(private readonly prisma: PrismaService) {}
  async createQuest(dto: CreateQuestDto, authorId: number) {
    return this.prisma.quest.create({
      data: {
        title: dto.title,
        description: dto.description,
        author_id: authorId,
      },
    });
  }
}
