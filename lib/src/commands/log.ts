import { findRepoRoot } from '../../util/file-system/find-repo-root';
import { GitCommit } from '../models/GitCommit';
import { catFileCommand } from './cat-file';
import { CommandResult } from './CommandResult';
import { notAGitRepoResult } from './shared/not-a-git-repo-result';

export const logCommand = async (
  fs: any,
  cwd: string,
  commitName: string,
): Promise<CommandResult> => {
  const repoRoot = await findRepoRoot(fs, cwd);
  if (!repoRoot) {
    return notAGitRepoResult;
  }

  const catFileResult = await catFileCommand(fs, cwd, 'commit', commitName);
  if (!catFileResult.success) {
    return catFileResult;
  }

  const commit = catFileResult.data as GitCommit;

  const messages = [];
  messages.push(`commit ${commit.getSha1()}`);
  messages.push(`Author: ${commit.author}`);
  if (commit.authorTimestamp) {
    messages.push(`Date:   ${commit.authorTimestamp}`);
  }
  messages.push('');
  messages.push(
    commit.message
      .split('\n')
      .map(line => `    ${line}`)
      .join('\n'),
  );

  return {
    success: true,
    message: messages.join('\n'),
  };
};
