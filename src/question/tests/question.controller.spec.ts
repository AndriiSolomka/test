/* eslint-disable */
import { Test, TestingModule } from '@nestjs/testing';
import { QuestionController } from '../question.controller';
import { QuestionService } from '../question.service';
import { MediaService } from '../../media/media.service';
import { BadRequestException } from '@nestjs/common';
import { DirNames } from '../../constants/enum/media/media';

describe('QuestionController', () => {
  let controller: QuestionController;
  let questionService: { create: jest.Mock };
  let mediaService: { saveFile: jest.Mock };

  beforeEach(async () => {
    questionService = { create: jest.fn() };
    mediaService = { saveFile: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionController],
      providers: [
        { provide: QuestionService, useValue: questionService },
        { provide: MediaService, useValue: mediaService },
      ],
    }).compile();

    controller = module.get<QuestionController>(QuestionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should parse options if it is a string', () => {
    const dto: any = { options: JSON.stringify([1, 2]), text: 'q' };
    const file = undefined;
    questionService.create.mockReturnValue('created');
    const result = controller.create(dto, file);
    expect(dto.options).toEqual([1, 2]);
    expect(questionService.create).toHaveBeenCalledWith(dto, undefined);
    expect(result).toBe('created');
  });

  it('should throw BadRequestException if options is invalid JSON', () => {
    const dto: any = { options: 'not-json', text: 'q' };
    expect(() => controller.create(dto, undefined)).toThrow(
      BadRequestException,
    );
  });

  it('should call mediaService.saveFile and pass imageUrl to service', () => {
    const dto: any = { options: [1, 2], text: 'q' };
    const file = { originalname: 'img.png' } as Express.Multer.File;
    const imageUrl = 'url/to/image.png';
    mediaService.saveFile.mockReturnValue(imageUrl);
    questionService.create.mockReturnValue('created');

    const result = controller.create(dto, file);

    expect(mediaService.saveFile).toHaveBeenCalledWith(
      file,
      DirNames.QUESTIONS,
    );
    expect(questionService.create).toHaveBeenCalledWith(dto, imageUrl);
    expect(result).toBe('created');
  });

  it('should call service.create with undefined imageUrl if no file', () => {
    const dto: any = { options: [1, 2], text: 'q' };
    questionService.create.mockReturnValue('created');
    const result = controller.create(dto, undefined);
    expect(questionService.create).toHaveBeenCalledWith(dto, undefined);
    expect(result).toBe('created');
  });
});
