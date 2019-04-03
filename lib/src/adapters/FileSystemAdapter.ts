import { IOAdapter } from './IOAdaper';
import * as fs from 'fs-extra';

export class FileSystemAdapter implements IOAdapter {
  async read(filePath: string): Promise<string> {
    return fs.readFile(filePath, 'utf8');
  }

  async write(filePath: string, contents: string): Promise<void> {
    return fs.writeFile(filePath, contents);
  }

  async isDirectory(path: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
