import { IOAdapter } from './IOAdaper';

export class MemoryAdapter implements IOAdapter {
  private fileSystem: {
    [filename: string]: string;
  } = {};

  async read(filePath: string): Promise<string> {
    if (filePath in this.fileSystem) {
      return Promise.resolve(this.fileSystem[filePath]);
    } else {
      throw new Error(`Cannot read file "${filePath}": file does not exist`);
    }
  }

  async write(filePath: string, contents: string): Promise<void> {
    this.fileSystem[filePath] = contents;
    return Promise.resolve();
  }

  async isDirectory(path: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
