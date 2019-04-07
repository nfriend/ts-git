import { CommandResult } from '../CommandResult';

export const notAGitRepoResult: CommandResult = {
  success: false,
  message:
    'fatal: not a git repository (or any of the parent directories): .git',
};
