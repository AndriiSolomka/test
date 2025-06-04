import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { JwtAuthGuard } from '../common/guards/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaService } from '../media/media.service';
import { DirNames } from '../constants/enum/media/media';
import { FileSizeValidationPipe } from '../common/pipes/file-size-validation.pipe';

@UseGuards(JwtAuthGuard)
@Controller('question')
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly mediaService: MediaService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createQuestionDto: CreateQuestionDto,
    @UploadedFile(new FileSizeValidationPipe()) file?: Express.Multer.File,
  ) {
    if (typeof createQuestionDto.options === 'string') {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        createQuestionDto.options = JSON.parse(createQuestionDto.options);
      } catch {
        throw new BadRequestException('Invalid options format');
      }
    }
    const imageUrl =
      file && this.mediaService.saveFile(file, DirNames.QUESTIONS);
    return this.questionService.create(createQuestionDto, imageUrl);
  }
}
