# ts-git

<img alt="ts-git logo" src="ts-git.png" width="250" height="250" />

A naïve implementation of [git](https://git-scm.com/), written in [TypeScript](https://www.typescriptlang.org/): http://ts-git.nathanfriend.io. Built to help me understand how git works under the hood.

This implementation is heavily based on the excellent [Write yourself a Git!](https://wyag.thb.lt/#org94e7cd7) tutorial.

Please don't actually use `ts-git` for anything serious :joy:.

This repo contains the source the [`ts-git` library](./lib), the [`ts-git-cli` CLI wrapper](./cli), and the [`ts-git` demo app](./demo-app).

## Usage

The `ts-git` library can be used in two ways: as an ES6 JavaScript module or as a command line utility.

### JavaScript module usage

This module is designed to work both in the browser and on the server (in Node).

First, install the module:

```bash
npm install @nathanfriend/ts-git --save
```

Then, import and use the module:

```ts
import { TsGit } from '@nathanfriend/ts-git';

const tsGit = new TsGit();

// View the documentation in the /lib directory
// of this repo for more usage details
```

More complete usage details can be found in the [`lib`](./lib) directory in this repo.

### Command line usage

First, install the `ts-git-cli` module globally:

```bash
npm install -g @nathanfriend/ts-git-cli
```

Then use the `ts-git-cli` command as a drop-in replacement for `git`:

```bash
ts-git-cli --help
```

More complete usage details can be found in the [`cli`](./cli) directory of this repo.
