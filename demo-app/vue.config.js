const MonocoEditorPlugin = require('monaco-editor-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

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

    // get a reference to the existing ForkTsCheckerWebpackPlugin
    const existingForkTsChecker = config.plugins.filter(
      p => p instanceof ForkTsCheckerWebpackPlugin,
    )[0];

    // remove the existing ForkTsCheckerWebpackPlugin
    // so that we can replace it with our modified version
    config.plugins = config.plugins.filter(
      p => !(p instanceof ForkTsCheckerWebpackPlugin),
    );

    // copy the options from the original ForkTsCheckerWebpackPlugin
    // instance and add the memoryLimit property
    const forkTsCheckerOptions = existingForkTsChecker.options;
    forkTsCheckerOptions.memoryLimit = 8192;

    config.plugins.push(new ForkTsCheckerWebpackPlugin(forkTsCheckerOptions));
  },
};
