const MonocoEditorPlugin = require('monaco-editor-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const v8 = require('v8');
v8.setFlagsFromString('--max_old_space_size=8192');

module.exports = {
  configureWebpack: config => {
    config.plugins.push(
      new MonocoEditorPlugin({
        // https://github.com/Microsoft/monaco-editor-webpack-plugin#options
        // Include a subset of languages support
        // Some language extensions like typescript are so huge that may impact build performance
        // e.g. Build full languages support with webpack 4.0 takes over 80 seconds
        // Languages are loaded on demand at runtime
        // languages: [],
      }),
    );

    config.plugins.push(new CompressionWebpackPlugin());

    // remove the exist ForkTsCheckerWebpackPlugin
    // so that we can replace it with our modified version
    config.plugins = config.plugins.filter(
      p => !(p instanceof ForkTsCheckerWebpackPlugin),
    );

    config.plugins.push(
      new ForkTsCheckerWebpackPlugin({
        vue: true,
        tslint: false,
        formatter: 'codeframe',
        checkSyntacticErrors: false,
        memoryLimit: 8192,
      }),
    );
  },
};
