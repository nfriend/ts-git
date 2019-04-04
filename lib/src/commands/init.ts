import * as path from 'path';
import { CommandResult } from './CommandResult';

export const initCommand = async (
  fs: any,
  cwd: string,
): Promise<CommandResult> => {
  const gitDir = path.join(cwd, '.git');

  // Test if we're already in the root of an existing git repo.
  let isInRootOfGitRepo = false;
  try {
    const stats = await fs.statAsync(gitDir);
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
  const filesToCreate = ['.git/HEAD', '.git/config', '.git/description'];

  for (const dir of dirsToCreate) {
    await fs.mkdirAsync(path.join(cwd, dir));
  }

  for (const file of filesToCreate) {
    await fs.appendFileAsync(path.join(cwd, file), '', 'utf8');
  }

  return {
    success: true,
    message: `Initialized empty Git repository in ${gitDir}`,
  };
};
