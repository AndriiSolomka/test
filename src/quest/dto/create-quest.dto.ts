import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateQuestDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}
