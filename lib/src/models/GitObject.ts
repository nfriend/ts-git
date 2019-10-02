import { GitObjectType } from './GitObjectType';

export abstract class GitObject {
  /** The type of this git object */
  abstract type: GitObjectType;

  /** The size of this git object */
  abstract getSize(): number;

  /** The SHA1 hash of this git object */
  abstract getSha1(): string;

  /** Gets the contents of this object, serialized as a string */
  abstract getContents(): string;

  /**
   * Serializes this object into a Buffer that can
   * be written to the file system
   */
  abstract async serialize(): Promise<Buffer>;

  /**
   * Deserializes file data into this object
   * @param fileContents The contents of the file
   * from the file system
   */
  abstract async deserialize(fileContents: Buffer): Promise<void>;
}
