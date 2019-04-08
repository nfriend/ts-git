import { Logger } from '../../util/Logger';
import * as browserfs from 'browserfs';
import * as bluebird from 'bluebird';
import * as sha1 from 'js-sha1';
import * as path from 'path';
import { hashObjectCommand } from '../../src/commands/hash-object';
import { catFileCommand } from '../../src/commands/cat-file';

const zlib = require('zlib');
bluebird.promisifyAll(zlib);

describe(`hash-object command`, () => {
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

      await fs.appendFileAsync(
        path.join('/test', 'subdirectory', 'my-file.txt'),
        gitObj,
      );

      done();
    });
  });

  it(`should write the provided file to git's internal storage`, async done => {
    const result = await hashObjectCommand(
      fs,
      path.join('/test', 'subdirectory'),
      path.join('/test', 'subdirectory', 'my-file.txt'),
      true,
    );

    expect(result).toEqual({
      success: true,
      message: gitObjSha,
      data: gitObjSha,
    });

    const catFileResult = await catFileCommand(
      fs,
      path.join('/test', 'subdirectory'),
      'blob',
      gitObjSha,
    );

    expect(catFileResult).toEqual({
      success: true,
      message: gitObj,
      data: gitObj,
    });

    done();
  });

  it(`should print the provided file's hash, but not write the file to git's internal storage`, async done => {
    const result = await hashObjectCommand(
      fs,
      path.join('/test', 'subdirectory'),
      path.join('/test', 'subdirectory', 'my-file.txt'),
      false,
    );

    expect(result).toEqual({
      success: true,
      message: gitObjSha,
      data: gitObjSha,
    });

    const catFileResult = await catFileCommand(
      fs,
      path.join('/test', 'subdirectory'),
      'blob',
      gitObjSha,
    );

    expect(catFileResult).toEqual({
      success: false,
      message: `fatal: Not a valid object name ${gitObjSha}`,
    });

    done();
  });
});
