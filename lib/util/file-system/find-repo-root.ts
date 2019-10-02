import Stats from 'browserfs/dist/node/core/node_fs_stats';
import * as path from 'path';

/**
 * Given the current working directory, navigates
 * through the directory's ancestor to find the
 * closest git repo (a directory with a .git child).
 * If no git repo is found, undefined is returned.
 * @param fs The curren implementation of fs
 * @param cwd The current working directory
 */
export const findRepoRoot = async (
  fs: any,
  cwd: string,
): Promise<string | undefined> => {
  let gitDirExists: boolean;
  try {
    const stats: Stats = await fs.lstatAsync(path.resolve(cwd, '.git'));
    gitDirExists = stats.isDirectory();
  } catch (err) {
    gitDirExists = false;
  }

  if (gitDirExists) {
    return cwd;
  } else {
    const parentDir = path.resolve(cwd, '../');

    if (parentDir !== cwd) {
      return await findRepoRoot(fs, parentDir);
    } else {
      return undefined;
    }
  }
};
