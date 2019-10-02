import * as path from 'path';
import { BrowserFSService } from './BrowserFS.service';
import { demoDirs, demoFiles } from './demo-files';
import { FileSystemItem, FileSystemService } from './FileSystem.service';

export class LocalStorageService {
  /**
   * Resets the file system to the "demo" state
   * @param fs The fs module to use to create the filesystem
   * @param force Reset the file system even
   * if the file system has been initialized previously
   */
  static async initializeDemoFileSystem(force: boolean = false) {
    const fs = await BrowserFSService.fsPromise;

    if (force || !localStorage.getItem(this.INIT_KEY)) {
      const rootDir = '/';

      for (const dir of demoDirs) {
        await fs.mkdirAsync(path.join(rootDir, dir));
      }

      for (const file in demoFiles) {
        await fs.appendFileAsync(
          path.join(rootDir, file),
          demoFiles[file],
          'utf8',
        );
      }

      localStorage.setItem(this.INIT_KEY, 'yes');
    }
  }

  /**
   * Resets the file system back to its initial demo state
   */
  static async resetFileSystem() {
    await this.clearFileSystem();
    await this.initializeDemoFileSystem(true);
  }

  /**
   * Deletes all files and folders in the file system
   * (Except for the root folder)
   */
  static async clearFileSystem() {
    this.setCollapsedFolders([]);
    await FileSystemService.deleteDirectoryContents('/');
  }

  static getCollapsedFolders(): string[] {
    return JSON.parse(localStorage.getItem(this.FOLDER_STATE_KEY)) || [];
  }

  static setCollapsedFolders(collapsedFolders: string[]) {
    localStorage.setItem(
      this.FOLDER_STATE_KEY,
      JSON.stringify(collapsedFolders),
    );
  }
  private static INIT_KEY: string = 'ts-git:has-demo-been-initialized';
  private static FOLDER_STATE_KEY: string = 'ts-git:folder-state';
}
