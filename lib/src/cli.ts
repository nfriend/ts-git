#!/usr/bin/env node
import * as yargsParser from 'yargs-parser';
import chalk from 'chalk';
import { TsGit } from './TsGit';

const argv = yargsParser(process.argv.slice(1));
const tsGit = new TsGit();

(async () => {
  const result = await tsGit.processArgv(argv);

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
})();
