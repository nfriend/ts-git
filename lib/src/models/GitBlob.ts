import { GitObject } from './GitObject';
import { GitObjectType } from './GitObjectType';

export class GitBlob extends GitObject {
  type: GitObjectType = 'blob';
}
