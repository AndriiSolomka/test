import { MediaService } from '../media.service';
import * as fileSystem from '../../utils/media/file-system';
import { DirNames } from '../../constants/enum/media/media';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as path from 'path';

jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

describe('MediaService', () => {
  let service: MediaService;

  beforeEach(() => {
    jest.spyOn(fileSystem, 'getUploadDir').mockReturnValue('/upload');
    jest.spyOn(fileSystem, 'ensureDirExists').mockImplementation(() => {});
    jest.spyOn(fileSystem, 'saveBufferToFile').mockImplementation(() => {});
    service = new MediaService();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('saveFile', () => {
    it('should throw BadRequestException if file is not provided', () => {
      expect(() =>
        service.saveFile(undefined as any, DirNames.QUESTIONS),
      ).toThrow(BadRequestException);
    });

    it('should save file and return correct path', () => {
      const file = {
        originalname: 'image.png',
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      const result = service.saveFile(file, DirNames.QUESTIONS);

      const expectedFolder = path.join('/upload', DirNames.QUESTIONS);
      const expectedFilePath = path.join(expectedFolder, 'test-uuid.png');
      expect(fileSystem.ensureDirExists).toHaveBeenCalledWith(expectedFolder);
      expect(fileSystem.saveBufferToFile).toHaveBeenCalledWith(
        expectedFilePath,
        file.buffer,
      );
      expect(result).toBe(
        `${DirNames.UPLOAD}/${DirNames.QUESTIONS}/test-uuid.png`,
      );
    });

    it('should throw InternalServerErrorException if saveBufferToFile fails', () => {
      const file = {
        originalname: 'image.png',
        buffer: Buffer.from('test'),
      } as Express.Multer.File;

      (fileSystem.saveBufferToFile as jest.Mock).mockImplementationOnce(() => {
        throw new Error('fail');
      });

      expect(() => service.saveFile(file, DirNames.QUESTIONS)).toThrow(
        InternalServerErrorException,
      );
    });
  });
});
