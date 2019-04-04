import { initCommand } from './commands/init';
import * as browserfs from 'browserfs';
import * as bluebird from 'bluebird';
import { CommandResult } from './commands/CommandResult';

// TODO: make sure this works in the browser
import * as fs from 'fs';
bluebird.promisifyAll(fs);

export type FileSystemType = 'InMemory' | 'LocalStorage' | 'FileSystem';

export class TsGit {
  private fsPromise: Promise<typeof fs>;

  constructor(fileSystemType: FileSystemType = 'FileSystem') {
    this.fsPromise = new Promise((resolve, reject) => {
      if (fileSystemType === 'LocalStorage') {
        reject('LocalStorage file system is not yet implemented!');
      } else if (fileSystemType === 'InMemory') {
        browserfs.configure({ fs: 'InMemory', options: {} }, err => {
          if (err) {
            reject(err);
          } else {
            const inMemoryFS: any = browserfs.BFSRequire('fs');
            bluebird.promisifyAll(inMemoryFS);
            resolve(inMemoryFS);
          }
        });
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
  async init(cwd: string): Promise<CommandResult> {
    const fs = await this.fsPromise;
    return await initCommand(fs, cwd);
  }
}
