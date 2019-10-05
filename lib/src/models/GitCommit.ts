import * as bluebird from 'bluebird';
import * as sha1 from 'js-sha1';
import * as moment from 'moment';
import { KeyValueListWithMessageParser } from '../../util/KeyValueListWithMessage';
import { GitObject } from './GitObject';
import { GitObjectType } from './GitObjectType';

const zlib = require('zlib');
bluebird.promisifyAll(zlib);

export class GitCommit extends GitObject {
  type: GitObjectType = 'commit';

  public tree: string;
  public parent: string;
  public author: string;
  public authorTimestamp: string;
  public committer: string;
  public committerTimestamp: string;
  public gpgsig: string;
  public message: string;

  private rawCommitData: string;

  private deserializePattern = /^commit ([0-9]+)\u0000(.*)$/s;

  getSize(): number {
    return this.rawCommitData.length;
  }

  getSha1(): string {
    return sha1(this.rawCommitData);
  }

  getContents(): string {
    return this.rawCommitData;
  }

  async serialize() {
    return await zlib.deflateAsync(this.serializeToString());
  }

  async deserialize(fileBuffer: Buffer) {
    const fileContents = (await zlib.unzipAsync(fileBuffer)).toString();
    const match = this.deserializePattern.exec(fileContents);
    const size = parseInt(match[1], 10);
    this.rawCommitData = match[2];

    const kvlm = KeyValueListWithMessageParser.parse(this.rawCommitData);
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

    if (this.getSize() !== size) {
      throw new Error(
        `Malformed object: object stated it was of size ${size}, ` +
          `but it really is of size ${this.getSize()}`,
      );
    }
  }

  private serializeToString(): string {
    return [this.type, ' ', this.getSize(), '\u0000', this.rawCommitData].join(
      '',
    );
  }

  private extractNameAndTimestamp(
    userString: string,
  ): { name: string; timestamp: string } {
    const nameTimeregex = /(.*) ([0-9]+ [+-][0-9]{4})$/;
    const matches = nameTimeregex.exec(userString);
    if (!matches) {
      return {
        name: userString,
        timestamp: '',
      };
    } else {
      return {
        name: matches[1],
        timestamp: moment(matches[2], 'X ZZ').format(
          'ddd MMM DD HH:mm:ss Y ZZ',
        ),
      };
    }
  }
}
