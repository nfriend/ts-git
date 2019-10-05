import * as yargsParser from 'yargs-parser';
import { GitObjectType } from '../models/GitObjectType';
import { TsGit } from '../TsGit';
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
    const dir = argv._[2] || '.';
    return tsGit.init(dir);
  } else if (command === 'cat-file') {
    const type = argv._[2];

    if (!['blob', 'commit', 'tag', 'tree'].includes(type)) {
      return Promise.resolve({
        success: false,
        message: `Usage: ts-git cat-file <type> <object>
<type> can be one of: blob, tree, commit, tag`,
      });
    }

    const object = argv._[3] || '';

    return tsGit.catFile('.', type as GitObjectType, object);
  } else if (command === 'hash-object') {
    const type = argv.t;

    if (type && !['blob', 'commit', 'tag', 'tree'].includes(type)) {
      return Promise.resolve({
        success: false,
        message: `Usage: ts-git hash-object [-t <type>] [-w] <file>
<type> can be one of: blob, tree, commit, tag`,
      });
    }

    const write = Boolean(argv.w);
    const filePath = argv._[2] || '';

    return tsGit.hashObject('.', filePath, write, type);
  } else if (command === 'log') {
    return tsGit.log('.', argv._[2]);
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

ts-git log <object>
  Shows the commit logs

ts-git cat-file <type> <object>
  Provide content or type and size information
  for repository objects

ts-git hash-object [-t <type>] [-w] <file>
  Compute object ID and optionally creates
  a blob from a file
`,
};
