export interface KeyValueList {
  [key: string]: string;
}

export interface KeyValueListWithMessage extends KeyValueList {
  message: string;
}

export class KeyValueListWithMessageParser {
  static parse(input: string): KeyValueListWithMessage {
    const kvlm: KeyValueListWithMessage = {
      message: undefined,
    };

    let keyMatcher = this.keyRegex.exec(input);

    while (keyMatcher) {
      const key = keyMatcher[1];
      kvlm[key] = '';
      input = input.replace(this.keyRegex, '');

      while (!this.isEndOfValue(input)) {
        kvlm[key] += input.charAt(0);
        input = input.substr(1);
      }

      input = input.replace(/^\s+/m, '');

      keyMatcher = this.keyRegex.exec(input);
    }

    kvlm.message = input;

    return kvlm;
  }

  private static keyRegex = /^(\S+) /;

  private static isEndOfValue(input: string): boolean {
    return input.charAt(0) === '\n' && !/^\n+ /.test(input);
  }
}
