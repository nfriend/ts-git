import { BrowserFSService } from './BrowserFS.service';
import * as path from 'path';
import { demoFiles, demoDirs } from './demo-files';
import { FileSystemService, FileSystemItem } from './FileSystem.service';

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
    await this.deleteDirectoryContents('/');
  }

  /**
   * Creates a new file at the provided path
   * The directory structure must already exist.
   * @param filePath The path of the file to create
   */
  static async createFile(filePath: string) {
    const fs = await BrowserFSService.fsPromise;

    await fs.writeFileAsync(filePath, '');
  }

  /**
   * Finds a single FileSystemItem in a file system structure.
   * If multiple matches are found, only the first is returned.
   * @param fileSystem The file system structure to search
   * @param filterFn A function that describes which items to select
   */
  static findItem(
    fileSystem: FileSystemItem[],
    filterFn: (item: FileSystemItem) => boolean,
  ): FileSystemItem {
    return this.findItems(fileSystem, filterFn)[0];
  }

  /**
   * Finds FileSystemItems in a file system structure.
   * @param fileSystem The file system structure to search
   * @param filterFn A function that describes which items to select
   */
  static findItems(
    fileSystem: FileSystemItem[],
    filterFn: (item: FileSystemItem) => boolean,
  ): FileSystemItem[] {
    let items: FileSystemItem[] = [];

    for (const item of fileSystem) {
      if (filterFn(item)) {
        items.push(item);
      }
      items = items.concat(this.findItems(item.children, filterFn));
    }

    return items;
  }

  /**
   * Creates a new file with a unique name
   * in the provided directory.  Returns the name
   * of the newly created file.
   * @param parentFolder The folder to create the new folder in
   */
  static async createNewFile(parentFolder: string): Promise<string> {
    return await this.createNewItem(parentFolder, 'file');
  }

  /**
   * Creates a new folder with a unique name
   * in the provided directory.  Returns the name
   * of the newly created folder.
   * @param parentFolder The folder to create the new folder in
   */
  static async createNewFolder(parentFolder: string): Promise<string> {
    return await this.createNewItem(parentFolder, 'folder');
  }

  /**
   * Creates a new file or folder with a unique name
   * in the provided directory.  Returns the name
   * of the newly created item.
   * @param parentFolder The folder to create the new item in
   * @param type The type of item to create (file or folder)
   */
  private static async createNewItem(
    parentFolder: string,
    type: 'file' | 'folder',
  ): Promise<string> {
    const fs = await BrowserFSService.fsPromise;

    const contents = await fs.readdirAsync(parentFolder);
    contents.map;
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
      if (await FileSystemService.isDirectory(itemPath)) {
        await this.deleteDirectoryContents(itemPath);
        await fs.rmdirAsync(itemPath);
      } else {
        await fs.unlinkAsync(itemPath);
      }
    }
  }
}
