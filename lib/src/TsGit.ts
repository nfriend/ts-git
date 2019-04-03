import { IOAdapter } from './adapters/IOAdaper';
import { FileSystemAdapter } from './adapters/FileSystemAdapter';
import { initCommand } from './commands/init';

export class TsGit {
  constructor(private ioAdapter: IOAdapter = new FileSystemAdapter()) {}

  // commands

  /**
   * Equivalent to to git's "init" command
   * @param cwd The current working directory
   */
  init(cwd: string) {
    initCommand(this.ioAdapter, cwd);
  }
}
