import * as bluebird from 'bluebird';
import * as browserfs from 'browserfs';
import * as path from 'path';
import { CommandResult } from '../../src';
import { catFileCommand } from '../../src/commands/cat-file';
import { Logger } from '../../util/Logger';

describe(`all commands`, () => {
  let fs: any;

  beforeAll(() => {
    Logger.isEnabled = false;
  });

  beforeEach(done => {
    browserfs.configure({ fs: 'InMemory', options: {} }, async err => {
      if (err) {
        fail(`An error occurred while creating the BrowserFS instance: ${err}`);
        return;
      }

      fs = browserfs.BFSRequire('fs');
      bluebird.promisifyAll(fs);

      await fs.mkdirAsync('/a-git-repo');
      await fs.mkdirAsync(path.join('/a-git-repo', '.git'));
      await fs.mkdirAsync(path.join('/a-git-repo', 'a-sub-dir'));
      await fs.mkdirAsync('/not-a-git-repo');

      done();
    });
  });

  it(`should return an error stating that the current directory isn't a git directory`, async done => {
    const commands = [
      async () => {
        return await catFileCommand(fs, '/not-a-git-repo', 'commit', 'abcde');
      },
    ];

    for (const command of commands) {
      const result = await command();
      expect(result).toEqual({
        success: false,
        message:
          'fatal: not a git repository (or any of the parent directories): .git',
      });
    }

    done();
  });

  it(`should _not_ return an error stating that the current directory isn't a git directory`, async done => {
    const commands = [
      async () => {
        return await catFileCommand(fs, '/a-git-repo', 'commit', 'abcde');
      },
    ];

    for (const command of commands) {
      const result = await command();
      expect(result).not.toEqual({
        success: false,
        message:
          'fatal: not a git repository (or any of the parent directories): .git',
      });
    }

    done();
  });

  it(`should _not_ return an error stating that the current directory - which is a subdirectory of the git repo -  isn't a git directory`, async done => {
    const commands = [
      async () => {
        return await catFileCommand(
          fs,
          path.join('/a-git-repo', 'a-sub-dir'),
          'commit',
          'abcde',
        );
      },
    ];

    for (const command of commands) {
      const result = await command();
      expect(result).not.toEqual({
        success: false,
        message:
          'fatal: not a git repository (or any of the parent directories): .git',
      });
    }

    done();
  });
});
