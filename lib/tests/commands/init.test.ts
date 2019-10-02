import * as bluebird from 'bluebird';
import * as browserfs from 'browserfs';
import Stats from 'browserfs/dist/node/core/node_fs_stats';
import { initCommand } from '../../src/commands/init';
import { Logger } from '../../util/Logger';

describe(`init command`, () => {
  let fs: any;

  beforeAll(() => {
    Logger.isEnabled = false;
  });

  beforeEach(done => {
    browserfs.configure({ fs: 'InMemory', options: {} }, err => {
      if (err) {
        fail(`An error occurred while creating the BrowserFS instance: ${err}`);
      } else {
        fs = browserfs.BFSRequire('fs');
        bluebird.promisifyAll(fs);
        done();
      }
    });
  });

  it(`should not do anything if a .git directory already exists`, async done => {
    await fs.mkdirAsync('/test');
    await fs.mkdirAsync('/test/.git');
    const result = await initCommand(fs, '/test');

    expect(result).toEqual({
      success: true,
      message: '/test/.git is already a repo. No action has been taken.',
    });

    done();
  });

  it(`if a .git directory doesn't already exist, should create all the expected directories and files`, async done => {
    fs.mkdirSync('/test');
    const result = await initCommand(fs, '/test');

    const expectedDirs = [
      '/test/.git',
      '/test/.git/objects',
      '/test/.git/refs',
      '/test/.git/refs/heads',
      '/test/.git/refs/tags',
    ];
    const expectedFiles = {
      '/test/.git/HEAD': 'ref: refs/heads/master\n',
      '/test/.git/description':
        "Unnamed repository; edit this file 'description' to name the repository.\n",
      '/test/.git/config':
        '[core]\n' +
        '\trepositoryformatversion = 0\n' +
        '\tfilemode = true\n' +
        '\tbare = false\n',
    };

    for (const dir of expectedDirs) {
      let stat: Stats;
      try {
        stat = await fs.statAsync(dir);
        expect(stat.isDirectory()).toBe(true);
      } catch (err) {
        fail(`directory "${dir}" was not created`);
      }
    }

    for (const file in expectedFiles) {
      let stat: Stats;
      try {
        stat = await fs.statAsync(file);
        expect(stat.isFile()).toBe(true);
      } catch (err) {
        fail(`file "${file}" was not created. Error: ${err}`);
      }

      const contents = await fs.readFileAsync(file, 'utf8');
      expect(contents).toBe(expectedFiles[file]);
    }

    expect(result).toEqual({
      success: true,
      message: 'Initialized empty Git repository in /test/.git',
    });

    done();
  });
});
