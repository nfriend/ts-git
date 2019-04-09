import { Logger } from '../../util/Logger';
import * as browserfs from 'browserfs';
import * as bluebird from 'bluebird';
import * as path from 'path';
import { hashObjectCommand } from '../../src/commands/hash-object';
import { catFileCommand } from '../../src/commands/cat-file';

const zlib = require('zlib');
bluebird.promisifyAll(zlib);

describe(`hash-object command`, () => {
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

      await fs.mkdirAsync('/test');
      await fs.mkdirAsync(path.join('/test', '.git'));
      await fs.mkdirAsync(path.join('/test', 'subdirectory'));

      await fs.appendFileAsync(
        path.join('/test', 'subdirectory', 'my-file.txt'),
        'This is a git file',
      );

      done();
    });
  });

  it(`should write the provided file to git's internal storage`, async done => {
    const hashObjectResult = await hashObjectCommand(
      fs,
      path.join('/test', 'subdirectory'),
      path.join('/test', 'subdirectory', 'my-file.txt'),
      true,
    );

    const catFileResult = await catFileCommand(
      fs,
      path.join('/test', 'subdirectory'),
      'blob',
      hashObjectResult.data.getSha1(),
    );

    expect(hashObjectResult).toEqual({
      success: true,
      message: catFileResult.data.getSha1(),
      data: catFileResult.data,
    });

    done();
  });

  it(`should print the provided file's hash, but not write the file to git's internal storage`, async done => {
    const hashObjectResult = await hashObjectCommand(
      fs,
      path.join('/test', 'subdirectory'),
      path.join('/test', 'subdirectory', 'my-file.txt'),
      false,
    );

    const catFileResult = await catFileCommand(
      fs,
      path.join('/test', 'subdirectory'),
      'blob',
      hashObjectResult.data.getSha1(),
    );

    expect(catFileResult).toEqual({
      success: false,
      message: `fatal: Not a valid object name ${hashObjectResult.data.getSha1()}`,
    });

    done();
  });
});
