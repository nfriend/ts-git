import * as bluebird from 'bluebird';
import * as browserfs from 'browserfs';
import * as nodeFsModule from 'fs';
import * as yargsParser from 'yargs-parser';
import { catFileCommand } from './commands/cat-file';
import { CommandResult } from './commands/CommandResult';
import { hashObjectCommand } from './commands/hash-object';
import { initCommand } from './commands/init';
import { processArgvCommand } from './commands/process-argv';
import { versionCommand } from './commands/version';
import { GitObjectType } from './models/GitObjectType';
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

  /**
   * Equivalent to git's "hash-object" command
   * @param cwd The current working directory
   * @param filePath The path to a file
   * @param write Whether or not to actually write the object
   * to the object database
   * @param type The object type
   */
  async hashObject(
    cwd: string,
    filePath: string,
    write: boolean = false,
    type: GitObjectType = 'blob',
  ): Promise<CommandResult> {
    try {
      const fs = await this.fsPromise;
      return await hashObjectCommand(fs, cwd, filePath, write, type);
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

  private getUexpectedResult(err): CommandResult {
    return {
      success: false,
      message: `An unexpected error occurred!\n${err}`,
    };
  }
}
