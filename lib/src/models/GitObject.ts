import * as bluebird from 'bluebird';
import * as sha1 from 'js-sha1';
import { GitObjectType } from './GitObjectType';

const zlib = require('zlib');
bluebird.promisifyAll(zlib);

export abstract class GitObject {
  /** The type of this git object */
  abstract type: GitObjectType;

  /** The raw contents of this object, serialized as a string */
  contents: string;

  /** The SHA1 hash of this git object */
  getSha1() {
    return sha1(this.contents);
  }

  /**
   * Serializes this object into a Buffer that can
   * be written to the file system
   */
  async serialize() {
    const serialized = [
      this.type,
      ' ',
      this.getSize(),
      '\u0000',
      this.contents,
    ].join('');

    return await zlib.deflateAsync(serialized);
  }

  /**
   * Deserializes file data into this object
   * @param fileContents The contents of the file
   * from the file system
   */
  async deserialize(fileBuffer: Buffer) {
    const deserializePattern = new RegExp(
      `^${this.type} ([0-9]+)\u0000(.*)$`,
      's',
    );
    const fileContents = (await zlib.unzipAsync(fileBuffer)).toString();
    const match = deserializePattern.exec(fileContents);
    const size = parseInt(match[1], 10);
    this.contents = match[2];

    if (this.getSize() !== size) {
      throw new Error(
        `Malformed object: object stated it was of size ${size}, ` +
          `but it really is of size ${this.getSize()}`,
      );
    }
  }

  /** The size of this git object */
  private getSize() {
    return this.contents.length;
  }
}
