import { BrowserFSService } from './BrowserFS.service';
import * as path from 'path';

export class LocalStorageService {
  private static INIT_KEY: string = 'ts-git:has-demo-been-initialized';

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

      const dirsToCreate = ['src', 'src/views', 'src/styles', 'src/scripts'];

      const filesToCreate = {
        'src/views/index.html': '<h1>Hello, world!</h1>',
        'src/styles/app.css': '.hello-world { background: red; }',
        'src/scripts/app.js': `console.log('hello, world!')`,
      };

      for (const dir of dirsToCreate) {
        await fs.mkdirAsync(path.join(rootDir, dir));
      }

      for (const file in filesToCreate) {
        await fs.appendFileAsync(
          path.join(rootDir, file),
          filesToCreate[file],
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
    await await this.deleteDirectoryContents('/');
  }

  /**
   * Recursively deletes all files and folders inside a directory
   * @param directory The directory whose contents will be deleted
   */
  private static async deleteDirectoryContents(directory: string) {
    const fs = await BrowserFSService.fsPromise;

    const contents = await fs.readdirAsync(directory);

    for (const item of contents) {
      const itemPath = path.join(directory, item);
      const isDirectory = (await fs.lstatSync(itemPath)).isDirectory();
      if (isDirectory) {
        await this.deleteDirectoryContents(itemPath);
        await fs.rmdirAsync(itemPath);
      } else {
        await fs.unlinkAsync(itemPath);
      }
    }
  }
}
