import * as path from 'path';
import { CommandResult } from './CommandResult';
import Stats from 'browserfs/dist/node/core/node_fs_stats';

export const initCommand = async (
  fs: any,
  directory: string,
): Promise<CommandResult> => {
  const gitDir = path.join(directory, '.git');

  // Test if the directory that was passed already exists
  let directoryAlreadyExists = false;
  try {
    const stats: Stats = await fs.statAsync(directory);
    directoryAlreadyExists = stats.isDirectory();
  } catch (err) {
    return {
      success: false,
      message:
        `The directory ${directory} does not exist. ` +
        `ts-git only supports initializing git repos in directories that already exist.`,
    };
  }

  // Test if we're already in the root of an existing git repo.
  let isInRootOfGitRepo = false;
  try {
    const stats: Stats = await fs.statAsync(gitDir);
    isInRootOfGitRepo = stats.isDirectory();
  } catch (err) {}

  // If we're already in a repo, don't do anything
  if (isInRootOfGitRepo) {
    return {
      success: true,
      message: `${gitDir} is already a repo. No action has been taken.`,
    };
  }

  // Now that we know we're _not_ in an existing git repo,
  // we need to scaffold the basic directory/file structure
  const dirsToCreate = [
    '.git',
    '.git/objects',
    '.git/refs',
    '.git/refs/heads',
    '.git/refs/tags',
  ];

  const filesToCreate = {
    '.git/HEAD': 'ref: refs/heads/master\n',
    '.git/description':
      "Unnamed repository; edit this file 'description' to name the repository.\n",
    '.git/config':
      '[core]\n' +
      '\trepositoryformatversion = 0\n' +
      '\tfilemode = true\n' +
      '\tbare = false\n',
  };

  for (const dir of dirsToCreate) {
    await fs.mkdirAsync(path.join(directory, dir));
  }

  for (const file in filesToCreate) {
    await fs.appendFileAsync(
      path.join(directory, file),
      filesToCreate[file],
      'utf8',
    );
  }

  return {
    success: true,
    message: `Initialized empty Git repository in ${gitDir}`,
  };
};
