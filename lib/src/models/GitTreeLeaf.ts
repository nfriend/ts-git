export class GitTreeLeaf {
  constructor(mode: string, path: string, sha: string) {
    this.mode = mode;
    this.path = path;
    this.sha = sha;
  }

  /** The file mode */
  mode: string;

  /** The file path */
  path: string;

  /** The SHA of the file */
  sha: string;
}
