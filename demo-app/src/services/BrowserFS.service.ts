import * as browserfs from 'browserfs';
import * as bluebird from 'bluebird';

export class BrowserFSService {
  private static _fsPromise: Promise<any>;

  static get fsPromise(): Promise<any> {
    if (!this._fsPromise) {
      this._fsPromise = new Promise((resolve, reject) => {
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

    return this._fsPromise;
  }
}
