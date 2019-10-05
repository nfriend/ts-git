import * as path from 'path';
import { findRepoRoot } from '../../util/file-system/find-repo-root';
import { GitBlob } from '../models/GitBlob';
import { GitCommit } from '../models/GitCommit';
import { GitObject } from '../models/GitObject';
import { GitObjectType } from '../models/GitObjectType';
import { CommandResult } from './CommandResult';
import { notAGitRepoResult } from './shared/not-a-git-repo-result';

export const hashObjectCommand = async (
  fs: any,
  cwd: string,
  filePath: string,
  write: boolean = false,
  type: GitObjectType = 'blob',
): Promise<CommandResult<GitObject>> => {
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

  let gitObj: GitObject;
  if (type === 'blob') {
    gitObj = new GitBlob();
  } else if (type === 'commit') {
    gitObj = new GitCommit();
  } else {
    throw new Error(`type ${type} is not yet implemented`);
  }

  gitObj.contents = fileBuffer.toString();

  if (write) {
    const sha1 = gitObj.getSha1();
    const gitObjDirectory = sha1.substring(0, 2);
    const gitObjFilename = sha1.substring(2);

    const zippedFileContents = await gitObj.serialize();
    const gitObjFilePath = path.join(
      repoRoot,
      '.git/objects',
      gitObjDirectory,
      gitObjFilename,
    );

    try {
      await fs.mkdirAsync(path.resolve(gitObjFilePath, '../'));
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
    message: gitObj.getSha1(),
    data: gitObj,
  };
};
