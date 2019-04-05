#!/usr/bin/env node
import { TsGit } from '@nathanfriend/ts-git';
import * as yargs from 'yargs';
import chalk from 'chalk';
import * as path from 'path';
import { reportResult } from './report-result';

const tsGit = new TsGit();

const argv = yargs
  .command(
    'init [directory]',
    'Create an empty Git repository',
    yargs => {
      return yargs.positional('directory', {
        describe: 'Optional directory to initialize the git repo in',
        default: process.cwd(),
      });
    },
    async (argv: any) => {
      const result = await tsGit.init(path.resolve(argv.directory));
      reportResult(result);
    },
  )
  .command(
    'cat-file <type> <object>',
    'Provide content or type and size information for repository objects',
    yargs => {
      return yargs
        .positional('type', { describe: 'The type of the object' })
        .positional('object', { describe: 'The name of the object to show' });
    },
    async (argv: any) => {
      const type = argv.type.toLowerCase();

      if (!['commit', 'blob', 'tag', 'tree'].includes(type)) {
        reportResult({
          success: false,
          message: `fatal: Not a valid object type: "${argv.type}"`,
        });
        return;
      }

      const result = await tsGit.catFile(process.cwd(), type, argv.object);
      reportResult(result);
    },
  )
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
