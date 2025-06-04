import { QuestService } from './quest.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreateQuestDto } from './dto/create-quest.dto';
import { UserId } from '../common/decorators/user_id.decorator';
import { JwtAuthGuard } from '../common/guards/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('quest')
export class QuestController {
  constructor(private readonly questService: QuestService) {}

  @Post()
  async create(@Body() dto: CreateQuestDto, @UserId() user_id: number) {
    const quest = await this.questService.createQuest(dto, user_id);
    return quest;
  }
}
