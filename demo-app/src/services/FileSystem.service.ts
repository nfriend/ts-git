import { BrowserFSService } from './BrowserFS.service';
import * as path from 'path';
import without from 'lodash/without';

export interface FileSystemItem {
  name: string;
  path: string;
  isFolder: boolean;
  isFolderOpen: boolean;
  children: FileSystemItem[];
  siblingNames: string[];
}

export class FileSystemService {
  /**
   * Recursively gets the contents of a directory
   * as a FileSystemItem[]
   * @param directory The root directory to fetch
   */
  static async getDirectoryContents(
    directory: string,
  ): Promise<FileSystemItem[]> {
    const filesAndFolders = await this.getDirectoryContentsRecurse(directory);
    this.sortFileSystemItems(filesAndFolders);
    return filesAndFolders;
  }

  /**
   * Gets the contents of a file as a string
   * @param filePath The path of the file to get
   */
  public static async getFileContents(filePath: string): Promise<string> {
    const fs = await BrowserFSService.fsPromise;

    try {
      return await fs.readFileAsync(filePath, 'utf8');
    } catch (err) {
      return '';
    }
  }

  /**
   * Renames a file or folder
   * @param oldPath The full path of the file or folder to rename
   * @param newPath The new path of the file or folder
   */
  public static async renameFileOrFolder(
    oldPath: string,
    newPath: string,
  ): Promise<void> {
    const fs = await BrowserFSService.fsPromise;
    await fs.renameAsync(oldPath, newPath);
  }

  /**
   * Returns a boolean indicating if the path is a directory
   * @param filePath The path to test
   */
  public static async isDirectory(filePath: string) {
    const fs = await BrowserFSService.fsPromise;

    return (await fs.lstatAsync(filePath)).isDirectory();
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

    const contents: string[] = (await fs.readdirAsync(parentFolder)).map(i =>
      i.toLowerCase(),
    );

    let newItemName = type === 'folder' ? 'new-folder' : 'new-file';
    let counter = 0;
    while (contents.includes(newItemName)) {
      counter++;
      newItemName =
        type === 'folder' ? `new-folder-${counter}` : `new-file-${counter}`;
    }

    const newPath = path.join(parentFolder, newItemName);

    if (type === 'folder') {
      await fs.mkdirAsync(newPath);
    } else {
      await fs.writeFileAsync(newPath, '');
    }

    return newPath;
  }

  /**
   * Recursively deletes all files and folders inside a directory
   * @param directory The directory whose contents will be deleted
   */
  static async deleteDirectoryContents(directory: string) {
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

  /**
   * Saves a string to a file
   * @param filePath The file path to save
   * @param fileContents The new contents of the file
   */
  static async saveFile(filePath: string, fileContents: string) {
    const fs = await BrowserFSService.fsPromise;

    await fs.writeFileAsync(filePath, fileContents);
  }

  private static async getDirectoryContentsRecurse(
    directory: string,
  ): Promise<FileSystemItem[]> {
    const fs = await BrowserFSService.fsPromise;

    const filesAndFolders: FileSystemItem[] = [];
    const contents = await fs.readdirAsync(directory);

    for (const item of contents) {
      const itemPath = path.join(directory, item);
      const isDirectory = await this.isDirectory(itemPath);

      filesAndFolders.push({
        name: item,
        path: itemPath,
        isFolder: isDirectory,
        isFolderOpen: isDirectory,
        children: isDirectory ? await this.getDirectoryContents(itemPath) : [],
        siblingNames: without(contents, item),
      });
    }

    return filesAndFolders;
  }

  private static sorter(a: FileSystemItem, b: FileSystemItem) {
    if (a.isFolder && !b.isFolder) {
      return -1;
    } else if (!a.isFolder && b.isFolder) {
      return 1;
    } else {
      const aName = a.name.toLowerCase();
      const bName = b.name.toLowerCase();
      if (aName < bName) {
        return -1;
      }
      if (aName > bName) {
        return 1;
      }

      return 0;
    }
  }

  private static sortFileSystemItems(items: FileSystemItem[]) {
    items.sort(this.sorter);
    for (const item of items) {
      if (item.isFolder) {
        this.sortFileSystemItems(item.children);
      }
    }
  }
}
