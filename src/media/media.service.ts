import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ensureDirExists,
  getUploadDir,
  saveBufferToFile,
} from '../utils/media/file-system';
import * as path from 'path';
import { DirNames } from '../constants/enum/media/media';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MediaService {
  private readonly uploadDir = getUploadDir(__dirname);
  constructor() {
    ensureDirExists(this.uploadDir);
  }

  saveFile(file: Express.Multer.File, type: DirNames): string {
    if (!file) throw new BadRequestException('File not provided');
    const folderPath = path.join(this.uploadDir, type);
    ensureDirExists(folderPath);
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    const filePath = path.join(folderPath, uniqueName);

    try {
      saveBufferToFile(filePath, file.buffer);
      return `${DirNames.UPLOAD}/${type}/${uniqueName}`;
    } catch (error) {
      throw new InternalServerErrorException(
        `Error during saving file: ${error}`,
      );
    }
  }
}
