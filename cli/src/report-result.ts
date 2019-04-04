import { CommandResult } from '@nathanfriend/ts-git';
import chalk from 'chalk';

/**
 * Given a CommandResult (the object returned by all of the
 * command function on the TsGit object), logs the message
 * to the console with the appropriate color
 * @param result The CommandResult object from TsGit
 */
export const reportResult = (result: CommandResult) => {
  if (result.success) {
    if (result.message) {
      console.log(result.message);
    }
  } else {
    if (result.message) {
      console.log(chalk.red(result.message));
    } else {
      console.log(chalk.red('An unexpected error occurred :('));
    }
  }
};
