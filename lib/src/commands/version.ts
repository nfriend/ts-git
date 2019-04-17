import { CommandResult } from './CommandResult';

export const versionCommand = async (): Promise<CommandResult<string>> => {
  const version = require('../../../package.json').version;

  return Promise.resolve({
    success: true,
    message: `ts-git version ${version}`,
    data: version,
  });
};
