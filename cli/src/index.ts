#!/usr/bin/env node
import { TsGit } from '@nathanfriend/ts-git';
import * as yargs from 'yargs';
import chalk from 'chalk';
import { reportResult } from './report-result';

const tsGit = new TsGit();

const argv = yargs
  .command('init', 'Create an empty Git repository', {}, async argv => {
    const result = await tsGit.init(process.cwd());
    reportResult(result);
  })
  .command('*', 'Default command', {}, argv => {
    // TODO: is there a better way to access the command and its parameters?
    if (argv._.length !== 0) {
      console.log(
        chalk.red(
          `ts-git doesn't know how to execute the ${chalk.whiteBright(
            argv._[0],
          )} command.`,
        ),
      );
      console.log(
        `This is either because you entered an invalid command or because ` +
          `ts-git hasn't implemented the feature you just tried.`,
      );
      console.log(chalk.gray(`(It's probably the latter :) )`));
      console.log(
        `To see a list of commands you ${chalk.bold(
          'can',
        )} use, run ${chalk.bold('ts-git --help')}`,
      );
    } else {
      console.log(chalk.red(`No command was provided to ts-git.`));
      console.log(
        `To see the list of available commands, run ${chalk.bold(
          'ts-git --help',
        )}`,
      );
    }
  })
  .help('h')
  .alias('h', 'help').argv;
