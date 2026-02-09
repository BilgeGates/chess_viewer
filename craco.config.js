const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    },

    configure: (webpackConfig) => {
      webpackConfig.resolve = {
        ...webpackConfig.resolve,
        extensions: ['.js', '.jsx', '.json'],
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        alias: {
          ...webpackConfig.resolve.alias,
          '@': path.resolve(__dirname, 'src')
        }
      };

      return webpackConfig;
    }
  },

  style: {
    postcss: {
      mode: 'extends'
    }
  }
};
