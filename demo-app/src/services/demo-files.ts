export const demoDirs = ['src', 'src/views', 'src/styles', 'src/scripts'];

export const demoFiles = {
  'src/views/index.html': `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <title>ts-git</title>
  </head>
  <body>
    <h1>Hello, world!</h1>
    <p>Welcome to ts-git!</p>
  </body>
</html>`,
  'src/styles/app.css': `html {
  font-family: sans-serif;
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

article, aside, figcaption, figure, footer, header, hgroup, main, nav, section {
  display: block;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  text-align: left;
  background-color: #fff;
}

[tabindex="-1"]:focus {
  outline: 0 !important;
}

hr {
  box-sizing: content-box;
  height: 0;
  overflow: visible;
}

h1, h2, h3, h4, h5, h6 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

p {
  margin-top: 0;
  margin-bottom: 1rem;
}`,
  'src/scripts/app.js': `const emptyObject = Object.freeze({});

// These helpers produce better VM code in JS engines due to their
// explicitness and function inlining.
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive.
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}`,
  'README.md': `# ts-git

<img alt="ts-git logo" src="ts-git.png" width="250" height="250" />

A naïve implementation of [git](https://git-scm.com/), written in [TypeScript](https://www.typescriptlang.org/): http://ts-git.nathanfriend.io. Built to help me understand how git works under the hood.

This implementation is heavily based on the excellent [Write yourself a Git!](https://wyag.thb.lt/#org94e7cd7) tutorial.

Please don't actually use \`ts-git\` for anything serious :joy:.

This repo contains the source the [\`ts-git\` library](./lib) and the [\`ts-git\` demo app](./demo-app).

## Usage

The \`ts-git\` library can be used in two ways: as an ES6 JavaScript module or as a command line utility.

### JavaScript module usage

This module is designed to work both in the browser and on the server (in Node).

First, install the module:

\`\`\`bash
npm install @nathanfriend/ts-git --save
\`\`\`

Then, import and use the module:

\`\`\`ts
import { TsGit } from '@nathanfriend/ts-git';

const tsGit = new TsGit();

// View the documentation in the /lib directory
// of this repo for more usage details
\`\`\`

More complete usage details can be found in the [\`lib\`](./lib) directory in this repo.

### Command line usage

First, install the \`ts-git\` module globally:

\`\`\`bash
npm install -g @nathanfriend/ts-git
\`\`\`

Then use the \`ts-git\` command as a drop-in replacement for \`git\`:

\`\`\`bash
ts-git init
\`\`\`

To the see the list of available commands, run \`ts-git --help\`.`,
  '.prettierrc.json': `{
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "all"
}`,
  '.gitlab-ci.yml': `image: node:8

pages:
  stage: deploy
  script:
    - cd lib
    - npm install
    - npm run build
    - cd ../demo-app
    - npm install
    - npm run build
    - cp -r dist ../public
  artifacts:
    paths:
      - public
  only:
    - master`,

  'src/main.ts': `import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faCaretDown,
  faCaretRight,
  faAlignLeft,
  faTrash,
  faFolderPlus,
  faFileMedical,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(
  faCaretDown,
  faCaretRight,
  faAlignLeft,
  faTrash,
  faFolderPlus,
  faFileMedical,
);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

Vue.use(BootstrapVue);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

`,
};
