import { CommandResult } from './CommandResult';
import { findRepoRoot } from '../../util/file-system/find-repo-root';

export type GitObjectType = 'blob' | 'commit' | 'tag' | 'tree';

export const catFileCommand = async (
  fs: any,
  cwd: string,
  type: GitObjectType,
  object: string,
): Promise<CommandResult> => {
  const repoRoot = await findRepoRoot(fs, cwd);
  if (!repoRoot) {
    return {
      success: false,
      message:
        'fatal: not a git repository (or any of the parent directories): .git',
    };
  }

  throw new Error('cat-file is not yet implemented!');
};
