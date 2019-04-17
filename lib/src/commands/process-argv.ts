import { TsGit } from '../TsGit';
import * as yargsParser from 'yargs-parser';
import { CommandResult } from './CommandResult';

export const processArgvCommand = async (
  tsGit: TsGit,
  argv: yargsParser.Arguments,
): Promise<CommandResult> => {
  const command = argv._[1];

  if (!command) {
    if (argv.version) {
      return await tsGit.version();
    } else {
      return Promise.resolve(helpResult);
    }
  } else if (command === 'help') {
    return Promise.resolve(helpResult);
  } else if (command === 'version') {
    return await tsGit.version();
  } else if (command === 'init') {
    const dir = argv._[2] || '/';
    return tsGit.init(dir);
  } else {
    const success = false;
    const message = `ts-git doesn't know how to execute the "${command}" command.

This is either because you entered an invalid command or because ts-git hasn't implemented the feature you just tried.

(It's probably the latter :) )

To see a list of all the commands you _can_ use, run "ts-git --help"`;

    return Promise.resolve({ success, message });
  }
};

const helpResult: CommandResult = {
  success: true,
  message: `usage: ts-git <command> [<args>]

Here is the complete list of commands implemented by ts-git:

ts-git init [directory]
  Create an empty ts-git repository
  
cat-file <type> <object>
  Provide content or type and size information
  for repository objects`,
};
