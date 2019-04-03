import * as fsModule from 'fs';

export const initCommand = (fs: typeof fsModule, cwd: string) => {
  console.log(`init was called with cwd: "${cwd}"!`);
};
