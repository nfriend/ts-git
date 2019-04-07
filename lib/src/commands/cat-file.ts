import { CommandResult } from './CommandResult';
import { findRepoRoot } from '../../util/file-system/find-repo-root';
import { notAGitRepoResult } from './shared/not-a-git-repo-result';
import * as path from 'path';
import * as bluebird from 'bluebird';

const zlib = require('zlib');
bluebird.promisifyAll(zlib);

export type GitObjectType = 'blob' | 'commit' | 'tag' | 'tree';

export const catFileCommand = async (
  fs: any,
  cwd: string,
  type: GitObjectType,
  object: string,
): Promise<CommandResult> => {
  const repoRoot = await findRepoRoot(fs, cwd);
  if (!repoRoot) {
    return notAGitRepoResult;
  }

  const objDirectory = object.substring(0, 2);
  const objFilename = object.substring(2);

  let fileBuffer: Buffer;
  try {
    const fileBuffer = await fs.readFileAsync(
      path.resolve(repoRoot, '.git', objDirectory, objFilename),
    );
  } catch (err) {
    return {
      success: false,
      message: `fatal: Not a valid object name ${object}`,
    };
  }

  let fileContents: string;
  try {
    fileContents = await zlib.inflateAsync(fileBuffer);
  } catch (err) {
    return {
      success: false,

      // TODO: what message does the real git show in this situation?
      message: `fatal: Unable to decompress object ${object}`,
    };
  }

  return {
    success: true,
    message: fileContents,
  };

  throw new Error('cat-file is not yet implemented!');
};
