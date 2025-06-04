import {
  IsNotEmpty,
  IsInt,
  IsString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { QuestionType } from '@prisma/client';
import { Type } from 'class-transformer';

export class CreateQuestionDto {
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  quest_id: number;

  @IsEnum(QuestionType)
  @IsNotEmpty()
  type: QuestionType;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsOptional()
  options?: { text: string; isCorrect: boolean }[];
}
