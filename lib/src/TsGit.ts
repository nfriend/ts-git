import { IOAdapter } from './adapters/IOAdaper';
import { FileSystemAdapter } from './adapters/FileSystemAdapter';
import { init } from './commands/init';

export class TsGit {
  ioAdapter: IOAdapter = new FileSystemAdapter();

  // commands
  init = init;
}
