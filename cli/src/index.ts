#!/usr/bin/env node
import { MyTestClass } from '@nathanfriend/ts-git';
import * as yargs from 'yargs';

console.log('something: ' + yargs.argv.something);
const test = new MyTestClass();
test.doSomething();
