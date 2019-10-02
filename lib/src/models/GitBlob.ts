import * as bluebird from 'bluebird';
import * as sha1 from 'js-sha1';
import { GitObject } from './GitObject';
import { GitObjectType } from './GitObjectType';

const zlib = require('zlib');
bluebird.promisifyAll(zlib);

export class GitBlob extends GitObject {
  type: GitObjectType = 'blob';

  public blobData: string;

  private deserializePattern = /^blob ([0-9]+)\u0000(.*)$/s;

  getSize(): number {
    return this.blobData.length;
  }
  getSha1(): string {
    return sha1(this.serializeToString());
  }
  getContents(): string {
    return this.blobData;
  }

  async serialize() {
    return await zlib.deflateAsync(this.serializeToString());
  }

  async deserialize(fileBuffer: Buffer) {
    const fileContents = (await zlib.unzipAsync(fileBuffer)).toString();
    const match = this.deserializePattern.exec(fileContents);
    const size = parseInt(match[1], 10);
    this.blobData = match[2];

    if (this.getSize() !== size) {
      throw new Error(
        `Malformed object: object stated it was of size ${size}, ` +
          `but it really is of size ${this.getSize()}`,
      );
    }
  }

  private serializeToString(): string {
    return [this.type, ' ', this.getSize(), '\u0000', this.blobData].join('');
  }
}
