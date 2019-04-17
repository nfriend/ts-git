import * as yargsParser from 'yargs-parser';
import { CommandResult } from './commands/CommandResult';
import { TsGit } from './TsGit';

export class CommandParser {
  static async parse(
    tsGit: TsGit,
    argv: yargsParser.Arguments,
  ): Promise<CommandResult> {
    const command = argv._[1];

    if (!command) {
      if (argv.version) {
        return await tsGit.version();
      } else {
        const success = true;
        const message = [
          `usage: ts-git <command> [<args>]`,
          ``,
          `Here is the complete list of commands implemented by ts-git:`,
          ``,
          `ts-git init [directory]`,
          `  Create an empty ts-git repository`,
          ``,
          `cat-file <type> <object>`,
          `  Provide content or type and size information`,
          `  for repository objects`,
        ].join('\n');

        return Promise.resolve({ success, message });
      }
    } else {
      const success = false;
      const message = [
        `ts-git doesn't know how to execute the "${command}" command.`,
        ``,
        `This is either because you entered an invalid command or because ` +
          `ts-git hasn't implemented the feature you just tried.`,
        `(It's probably the latter :) )`,
        ``,
        `To see a list of all the commands you _can_ use, run "ts-git --help"`,
      ].join('\n');

      return Promise.resolve({ success, message });
    }
  }
}
