import { BrowserFSService } from './BrowserFS.service';
import * as path from 'path';

export class LocalStorageInitializationService {
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
}
