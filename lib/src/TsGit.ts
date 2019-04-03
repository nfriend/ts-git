import { initCommand } from './commands/init';
import * as browserfs from 'browserfs';
import * as fs from 'fs';

export type FileSystemType = 'InMemory' | 'LocalStorage' | 'FileSystem';

export class TsGit {
  private fsPromise: Promise<typeof fs>;

  constructor(fileSystemType: FileSystemType = 'FileSystem') {
    this.fsPromise = new Promise((resolve, reject) => {
      if (fileSystemType === 'LocalStorage') {
        reject('LocalStorage file system is not yet implemented!');
      } else if (fileSystemType === 'InMemory') {
        reject('InMemory file system is not yet implemented!');
      } else if (fileSystemType === 'FileSystem') {
        resolve(fs);
      } else {
        reject(
          `Unknown file system type: "${fileSystemType}". ` +
            ` Expected 'InMemory', 'LocalStorage', or 'FileSystem'`,
        );
      }
    });
  }

  // Commands

  /**
   * Equivalent to to git's "init" command
   * @param cwd The current working directory
   */
  async init(cwd: string): Promise<void> {
    const fs = await this.fsPromise;
    initCommand(fs, cwd);
  }
}
