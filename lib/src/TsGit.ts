import * as browserfs from 'browserfs';
import * as bluebird from 'bluebird';
import * as yargsParser from 'yargs-parser';
import { initCommand } from './commands/init';
import { CommandResult } from './commands/CommandResult';
import { catFileCommand } from './commands/cat-file';
import { GitObjectType } from './models/GitObjectType';
import * as nodeFsModule from 'fs';
import { versionCommand } from './commands/version';
import { processArgvCommand } from './commands/process-argv';
bluebird.promisifyAll(nodeFsModule);

export type FileSystemType = 'InMemory' | 'LocalStorage' | 'FileSystem';

export class TsGit {
  fsPromise: Promise<typeof nodeFsModule>;

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
        resolve(nodeFsModule);
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

  async version(): Promise<CommandResult> {
    try {
      return await versionCommand();
    } catch (err) {
      return this.getUexpectedResult(err);
    }
  }

  async processArgv(argv: yargsParser.Arguments): Promise<CommandResult> {
    try {
      return await processArgvCommand(this, argv);
    } catch (err) {
      return this.getUexpectedResult(err);
    }
  }
}
