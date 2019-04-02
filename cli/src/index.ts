#!/usr/bin/env node
import { TsGit } from '@nathanfriend/ts-git';
import * as yargs from 'yargs';

console.log('something: ' + yargs.argv.something);
const test = new TsGit();
test.init();
