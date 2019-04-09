import * as path from 'path';
import * as bluebird from 'bluebird';
import { GitObjectType } from '../models/GitObjectType';
import { CommandResult } from './CommandResult';
import { findRepoRoot } from '../../util/file-system/find-repo-root';
import { notAGitRepoResult } from './shared/not-a-git-repo-result';
import { GitObject } from '../models/GitObject';
import { GitBlob } from '../models/GitBlob';

const zlib = require('zlib');
bluebird.promisifyAll(zlib);

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
    const blob = new GitBlob();
    blob.blobData = fileBuffer.toString();
    gitObj = blob;
  } else {
    throw new Error(`type ${type} is not yet implemented`);
  }

  if (write) {
    const sha1 = gitObj.getSha1();
    const gitObjDirectory = sha1.substring(0, 2);
    const gitObjFilename = sha1.substring(2);

    const zippedFileContents = await gitObj.serialize();
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
    message: gitObj.getSha1(),
    data: gitObj,
  };
};
