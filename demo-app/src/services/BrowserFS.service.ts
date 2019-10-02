import * as bluebird from 'bluebird';
import * as browserfs from 'browserfs';

export class BrowserFSService {
  private static internalFsPromise: Promise<any>;

  static get fsPromise(): Promise<any> {
    if (!this.internalFsPromise) {
      this.internalFsPromise = new Promise((resolve, reject) => {
        browserfs.configure({ fs: 'LocalStorage', options: {} }, err => {
          if (err) {
            reject(err);
          } else {
            const localStorageFS: any = browserfs.BFSRequire('fs');
            bluebird.promisifyAll(localStorageFS);
            resolve(localStorageFS);
          }
        });
      });
    }

    return this.internalFsPromise;
  }
}
