import * as path from 'path';
import * as sha1 from 'js-sha1';
import * as bluebird from 'bluebird';
import { GitObjectType } from './shared/GitObjectType';
import { CommandResult } from './CommandResult';
import { findRepoRoot } from '../../util/file-system/find-repo-root';
import { notAGitRepoResult } from './shared/not-a-git-repo-result';

const zlib = require('zlib');
bluebird.promisifyAll(zlib);

export const hashObjectCommand = async (
  fs: any,
  cwd: string,
  filePath: string,
  write: boolean = false,
  type: GitObjectType = 'blob',
): Promise<CommandResult<string>> => {
  const repoRoot = await findRepoRoot(fs, cwd);
  if (!repoRoot) {
    return notAGitRepoResult;
  }

  let fileBuffer: Buffer;
  try {
    fileBuffer = await fs.readFileAsync(path.resolve(filePath));
  } catch (err) {
    return {
      success: false,
      message: `fatal: Cannot open ${filePath}: No such file or directory`,
    };
  }

  const fileContents = fileBuffer.toString();
  const fileSha1 = sha1(fileContents);

  if (write) {
    const gitObjDirectory = fileSha1.substring(0, 2);
    const gitObjFilename = fileSha1.substring(2);

    const zippedFileContents = await zlib.deflateAsync(fileContents);
    const gitObjFilePath = path.join(
      repoRoot,
      '.git',
      gitObjDirectory,
      gitObjFilename,
    );

    try {
      await fs.mkdirAsync(path.join(gitObjFilePath, '../'));
      await fs.appendFileAsync(gitObjFilePath, zippedFileContents);
    } catch (err) {
      return {
        success: false,
        message: `fatal: An error occurred while writing to ${gitObjFilePath}: ${err}`,
      };
    }
  }

  return {
    success: true,
    message: fileSha1,
    data: fileSha1,
  };
};
