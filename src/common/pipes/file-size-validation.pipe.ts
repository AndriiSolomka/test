import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Size } from '../../constants/enum/media/media';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(file: Express.Multer.File | undefined) {
    if (!file) {
      return file;
    }
    const maxSize = Number(Size.MAX_SIZE);
    if (file.size > maxSize) {
      throw new BadRequestException(
        `File size must be less than ${maxSize} bytes`,
      );
    }
    return file;
  }
}
