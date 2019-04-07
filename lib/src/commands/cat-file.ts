import { CommandResult } from './CommandResult';
import { findRepoRoot } from '../../util/file-system/find-repo-root';
import { notAGitRepoResult } from './shared/not-a-git-repo-result';

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

  throw new Error('cat-file is not yet implemented!');
};
