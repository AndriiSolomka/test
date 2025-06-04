import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';

@Injectable()
export class QuestionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createQuestion(dto: CreateQuestionDto, imageUrl?: string) {
    return this.prisma.question.create({
      data: {
        quest_id: dto.quest_id,
        type: dto.type,
        content: dto.content,
        imageUrl: imageUrl,
        options: this.buildOptions(dto.options),
      },
      include: { options: true },
    });
  }

  private buildOptions(options?: { text: string; isCorrect: boolean }[]) {
    return options
      ? {
          create: options.map((opt) => ({
            text: opt.text,
            isCorrect: opt.isCorrect,
          })),
        }
      : undefined;
  }
}
