import { GitObject } from './GitObject';
import { GitObjectType } from './GitObjectType';
import { GitTreeLeaf } from './GitTreeLeaf';

export class GitTree extends GitObject {
  type: GitObjectType = 'commit';

  leaves: GitTreeLeaf[];

  async deserialize(fileBuffer: Buffer) {
    await super.deserialize(fileBuffer);
    this.leaves = this.parseTree(this.contents);
  }

  private parseTree(str: string): GitTreeLeaf[] {}

  private parseLeaf(str: string, startIndex: number) {
    const spaceIndex = str.indexOf(' ', startIndex);
    if (!(spaceIndex - startIndex === 5 || spaceIndex - startIndex === 6)) {
      throw new Error('Expected the space to be at either index 5 or 6');
    }

    const mode = str.substring(startIndex, spaceIndex);

    const nullIndex = str.indexOf('\u0000', spaceIndex);
    const path = str.substring(spaceIndex + 1, nullIndex);
  }
}
