import { Logger } from '../../util/Logger';
import * as browserfs from 'browserfs';
import * as bluebird from 'bluebird';
import * as sha1 from 'js-sha1';
import * as path from 'path';
import { catFileCommand } from '../../src/commands/cat-file';
import { hashObjectCommand } from '../../src/commands/hash-object';

describe(`cat-file command`, () => {
  let fs: any;
  const gitObj = 'This is a test git file';
  const gitObjSha = sha1(gitObj);

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

      await fs.mkdirAsync('/test');
      await fs.mkdirAsync(path.join('/test', '.git'));
      await fs.mkdirAsync(path.join('/test', 'subdirectory'));
      const filePath = path.join('/test', 'subdirectory', 'my-file.txt');
      await fs.appendFileAsync(filePath, gitObj);
      await hashObjectCommand(fs, '/test', filePath, true);

      done();
    });
  });

  it(`should return the unzipped contents a file when a valid hash is provided`, async done => {
    const result = await catFileCommand(fs, '/test', 'commit', gitObjSha);

    expect(result).toEqual({
      success: true,
      message: gitObj,
      data: gitObj,
    });

    done();
  });

  it(`should return the unzipped contents a file when a valid hash is provided even if called in a subdirectory of a git repo`, async done => {
    const result = await catFileCommand(
      fs,
      path.join('/test', 'subdirectory'),
      'commit',
      gitObjSha,
    );

    expect(result).toEqual({
      success: true,
      message: gitObj,
      data: gitObj,
    });

    done();
  });
});
