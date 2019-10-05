import * as path from 'path';
import { catFileCommand } from '../../src/commands/cat-file';
import { logCommand } from '../../src/commands/log';
import { GitCommit } from '../../src/models/GitCommit';
import { Logger } from '../../util/Logger';

jest.mock('../../util/file-system/find-repo-root', () => ({
  findRepoRoot: jest.fn().mockImplementation(() => './repo/root'),
}));

jest.mock('../../src/commands/cat-file', () => {
  const commits = {
    abcd: {
      getSha1: () => 'abcd',
      author: 'Nathan Friend',
      message: 'This is the first commit\n',
    } as GitCommit,
    bcde: {
      getSha1: () => 'bcde',
      parent: 'abcd',
      author: 'Nathan Friend <nathan@gitlab.com>',
      authorTimestamp: {
        format: jest.fn().mockImplementation(() => 'timestamp'),
      } as any,
      message: 'This is the second commit\n\nIt has a description.\n',
    } as GitCommit,
    cdef: {
      getSha1: () => 'cdef',
      parent: 'bcde',
      author: 'Nathan Friend',
      message: 'This is the third commit\n',
    } as GitCommit,
  };

  const catFileMock: typeof catFileCommand = async (
    fs,
    cwd,
    type,
    object: string,
  ) => {
    return {
      success: true,
      message: 'catFileCommand output here',
      data: commits[object],
    };
  };

  return {
    catFileCommand: jest.fn().mockImplementation(catFileMock),
  };
});

describe(`log command`, () => {
  beforeAll(() => {
    Logger.isEnabled = false;
  });

  it(`should return a for`, async () => {
    const logResult = await logCommand(
      jest.genMockFromModule('fs'),
      path.join('/test', 'subdirectory'),
      'cdef',
    );

    const expectedMessage = `commit cdef
Author: Nathan Friend

    This is the third commit
    
commit bcde
Author: Nathan Friend <nathan@gitlab.com>
Date:   timestamp

    This is the second commit
    
    It has a description.
    
commit abcd
Author: Nathan Friend

    This is the first commit
    `;

    expect(logResult).toEqual({
      success: true,
      message: expectedMessage,
    });
  });
});
