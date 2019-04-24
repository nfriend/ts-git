export const demoDirs = ['src', 'src/views', 'src/styles', 'src/scripts'];

export const demoFiles = {
  'src/views/index.html': require('!!raw-loader!../../public/index.html')
    .default,
  'src/styles/app.css': require('!!raw-loader!../../node_modules/bootstrap-vue/dist/bootstrap-vue.css')
    .default,
  'src/scripts/app.js': require('!!raw-loader!../../node_modules/lodash/debounce.js')
    .default,
  'README.md': require('!!raw-loader!../../../README.md').default,
  '.gitlab-ci.yml': require('!!raw-loader!../../../.gitlab-ci.yml').default,
  '.prettierrc.json': JSON.stringify(
    require('../../../.prettierrc.json'),
    null,
    2,
  ),
  'package.json': JSON.stringify(require('../../../lib/package.json'), null, 2),
  'src/main.ts': require('!!raw-loader!../main.ts').default,
};
