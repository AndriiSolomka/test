import * as fs from 'fs';
import * as path from 'path';
import { DirNames } from '../../constants/enum/media/media';

export function ensureDirExists(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

export function saveBufferToFile(filePath: string, buffer: Buffer) {
  fs.writeFileSync(filePath, buffer);
}

export function getUploadDir(dirname: string): string {
  return path.resolve(dirname, '..', '..', DirNames.UPLOAD);
}
