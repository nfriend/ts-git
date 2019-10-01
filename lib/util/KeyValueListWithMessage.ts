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

    return this.parseRecurse(input, 0, kvlm);
  }

  private static parseRecurse(
    input: string,
    startIndex: number,
    kvlm: KeyValueListWithMessage,
  ): KeyValueListWithMessage {
    const firstSpaceIndex = input.indexOf(' ', startIndex);
    const firstNewLineIndex = input.indexOf('\n', startIndex);

    if (firstSpaceIndex === -1 || firstNewLineIndex < firstSpaceIndex) {
      // There's no space, or the newline appears before the space.
      // The rest of the input is the message.

      if (firstNewLineIndex !== startIndex) {
        throw new Error(
          'Parse error: expected newline index to be === start index',
        );
      }

      kvlm.message = input.substring(startIndex + 1);
      return kvlm;
    } else {
      // We're reading a key/value pair.

      const key = input.substring(startIndex, firstSpaceIndex);

      // Find the end of the value by looping until we find
      // a newline _not_ followed by a space
      let valueEndIndex = startIndex;
      while (true) {
        valueEndIndex = input.indexOf('\n', valueEndIndex + 1);
        if (valueEndIndex === -1) {
          throw new Error("Parse error: couldn't find a newline");
        }

        if (input.charAt(valueEndIndex + 1) !== ' ') {
          break;
        }
      }
      const value = input
        .substring(firstSpaceIndex + 1, valueEndIndex)
        .replace(/\n /g, '\n');

      kvlm[key] = kvlm[key] || value;

      return this.parseRecurse(input, valueEndIndex + 1, kvlm);
    }
  }
}

export class KeyValueListWithMessageSerializer {
  static serialize(kvlm: KeyValueListWithMessage): string {
    let strs: string[] = [];
    for (const key in kvlm) {
      if (key !== 'message') {
        const value = kvlm[key].replace(/\n/g, '\n ');
        strs.push(`${key} ${value}`);
      }
    }

    strs.push('');
    strs.push(kvlm.message);

    return strs.join('\n');
  }
}
