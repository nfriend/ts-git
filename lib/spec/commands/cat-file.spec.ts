import { Logger } from '../../util/Logger';
import * as browserfs from 'browserfs';
import * as bluebird from 'bluebird';
import * as sha1 from 'js-sha1';
import * as path from 'path';
import { catFileCommand } from '../../src/commands/cat-file';

const zlib = require('zlib');
bluebird.promisifyAll(zlib);

describe(`init command`, () => {
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

      const gitObjDirectory = gitObjSha.substring(0, 2);
      const gitObjFilename = gitObjSha.substring(2);
      const zippedGitObj = await zlib.deflateAsync(gitObj);

      await fs.mkdirAsync('/test');
      await fs.mkdirAsync(path.join('/test', '.git'));
      await fs.mkdirAsync(path.join('/test', '.git', gitObjDirectory));

      await fs.appendFileAsync(
        path.join('/test', '.git', gitObjDirectory, gitObjFilename),
        zippedGitObj,
      );

      done();
    });
  });

  it(`should return the unzipped contents a file when a valid hash is provided`, async done => {
    const result = await catFileCommand(fs, '/test', 'commit', gitObjSha);

    expect(result).toEqual({
      success: true,
      message: gitObj,
    });

    done();
  });
});
