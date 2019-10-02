import * as bluebird from 'bluebird';
import * as browserfs from 'browserfs';
import { findRepoRoot } from '../../../util/file-system/find-repo-root';

describe(`findRepoRoot`, () => {
  let fs: any;

  beforeEach(done => {
    browserfs.configure({ fs: 'InMemory', options: {} }, async err => {
      if (err) {
        fail(`An error occurred while creating the BrowserFS instance: ${err}`);
      } else {
        fs = browserfs.BFSRequire('fs');
        bluebird.promisifyAll(fs);

        const dirsToCreate = [
          '/grandparent',
          '/grandparent/parent',
          '/grandparent/parent/child',
          '/grandparent/parent/.git',
          '/grandparent/uncle',
        ];

        for (const dir of dirsToCreate) {
          await fs.mkdirAsync(dir);
        }

        done();
      }
    });
  });

  it(`should return the current directory if the current directory is a git repo`, async done => {
    const root = await findRepoRoot(fs, '/grandparent/parent');
    expect(root).toBe('/grandparent/parent');
    done();
  });

  it(`should return the parent directory if the current directory is child directory of the git repo`, async done => {
    const root = await findRepoRoot(fs, '/grandparent/parent/child');
    expect(root).toBe('/grandparent/parent');
    done();
  });

  it(`should return undefined if the directory isn't in a git repo`, async done => {
    const root = await findRepoRoot(fs, '/grandparent/uncle');
    expect(root).toBeUndefined();
    done();
  });
});
