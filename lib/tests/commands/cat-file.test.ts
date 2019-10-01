import { Logger } from '../../util/Logger';
import * as browserfs from 'browserfs';
import * as bluebird from 'bluebird';
import * as sha1 from 'js-sha1';
import * as path from 'path';
import { catFileCommand } from '../../src/commands/cat-file';
import { hashObjectCommand } from '../../src/commands/hash-object';
import { GitBlob } from '../../src/models/GitBlob';

describe(`cat-file command`, () => {
  let fs: any;
  let gitObj: GitBlob;

  beforeAll(() => {
    Logger.isEnabled = false;
  });

  beforeEach(done => {
    gitObj = new GitBlob();
    gitObj.blobData = 'This is a test git file';

    browserfs.configure({ fs: 'InMemory', options: {} }, async err => {
      if (err) {
        fail(`An error occurred while creating the BrowserFS instance: ${err}`);
        return;
      }

      fs = browserfs.BFSRequire('fs');
      bluebird.promisifyAll(fs);

      await fs.mkdirAsync('/test');
      await fs.mkdirAsync(path.join('/test', '.git'));
      await fs.mkdirAsync(path.join('/test', '.git', 'objects'));
      await fs.mkdirAsync(path.join('/test', 'subdirectory'));
      const filePath = path.join('/test', 'subdirectory', 'my-file.txt');
      await fs.appendFileAsync(filePath, gitObj.blobData);
      await hashObjectCommand(fs, '/test', filePath, true, 'blob');

      done();
    });
  });

  it(`should return the unzipped contents a file when a valid hash is provided`, async done => {
    const result = await catFileCommand(fs, '/test', 'blob', gitObj.getSha1());

    expect(result).toEqual({
      success: true,
      message: gitObj.blobData,
      data: gitObj,
    });

    done();
  });
});
