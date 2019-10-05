import * as moment from 'moment';
import { KeyValueListWithMessageParser } from '../../util/KeyValueListWithMessage';
import { GitObject } from './GitObject';
import { GitObjectType } from './GitObjectType';

export class GitCommit extends GitObject {
  type: GitObjectType = 'commit';

  public tree: string;
  public parent: string;
  public author: string;
  public authorTimestamp: moment.Moment;
  public committer: string;
  public committerTimestamp: moment.Moment;
  public gpgsig: string;
  public message: string;

  async deserialize(fileBuffer: Buffer) {
    await super.deserialize(fileBuffer);

    const kvlm = KeyValueListWithMessageParser.parse(this.contents);
    this.tree = kvlm.tree;
    this.parent = kvlm.parent;

    const authorTimeDate = this.extractNameAndTimestamp(kvlm.author);
    this.author = authorTimeDate.name;
    this.authorTimestamp = authorTimeDate.timestamp;

    const committerTimeDate = this.extractNameAndTimestamp(kvlm.committer);
    this.committer = committerTimeDate.name;
    this.committerTimestamp = committerTimeDate.timestamp;

    this.gpgsig = kvlm.gpgsig;
    this.message = kvlm.message;
  }

  private extractNameAndTimestamp(
    userString: string,
  ): { name: string; timestamp: moment.Moment } {
    const nameTimeregex = /(.*) ([0-9]+ [+-][0-9]{4})$/;
    const matches = nameTimeregex.exec(userString);
    if (!matches) {
      return {
        name: userString,
        timestamp: undefined,
      };
    } else {
      return {
        name: matches[1],
        timestamp: moment(matches[2], 'X ZZ'),
      };
    }
  }
}
