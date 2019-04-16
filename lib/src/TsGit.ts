import { initCommand } from './commands/init';
import * as browserfs from 'browserfs';
import * as bluebird from 'bluebird';
import { CommandResult } from './commands/CommandResult';
import { catFileCommand } from './commands/cat-file';
import { GitObjectType } from './models/GitObjectType';

// TODO: make sure this works in the browser
import * as fs from 'fs';
bluebird.promisifyAll(fs);

export type FileSystemType = 'InMemory' | 'LocalStorage' | 'FileSystem';

export class TsGit {
  private fsPromise: Promise<typeof fs>;

  constructor(fileSystemType: FileSystemType = 'FileSystem') {
    this.fsPromise = new Promise((resolve, reject) => {
      if (fileSystemType === 'LocalStorage') {
        browserfs.configure({ fs: 'LocalStorage', options: {} }, err => {
          if (err) {
            reject(err);
          } else {
            const localStorageFS: any = browserfs.BFSRequire('fs');
            bluebird.promisifyAll(localStorageFS);
            resolve(localStorageFS);
          }
        });
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

  private getUexpectedResult(err): CommandResult {
    return {
      success: false,
      message: `An unexpected error occurred!\n${err}`,
    };
  }

  // Commands

  /**
   * Equivalent to git's "init" command
   * @param cwd The current working directory
   */
  async init(cwd: string): Promise<CommandResult> {
    try {
      const fs = await this.fsPromise;
      return await initCommand(fs, cwd);
    } catch (err) {
      return this.getUexpectedResult(err);
    }
  }

  /**
   * Equivalent to git's "cat-file" command
   * @param cwd The current working directory
   * @param type The type of the object
   * @param object The name of the object to show
   */
  async catFile(
    cwd: string,
    type: GitObjectType,
    object: string,
  ): Promise<CommandResult> {
    try {
      const fs = await this.fsPromise;
      return await catFileCommand(fs, cwd, type, object);
    } catch (err) {
      return this.getUexpectedResult(err);
    }
  }
}
