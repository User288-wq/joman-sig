// craco.config.js
const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (config) => {
      // RÃƒÂ©soudre les problÃƒÂ¨mes de polyfills
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "zlib": require.resolve("browserify-zlib"),
        "https": require.resolve("https-browserify"),
        "http": require.resolve("stream-http"),
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert/"),
        "url": require.resolve("url/"),
        "buffer": require.resolve("buffer/"),
        "fs": false,
        "path": false
      };

      // Ajouter les plugins pour buffer
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        })
      );

      // Ignorer certains avertissements
      config.ignoreWarnings = [
        { module: /@cesium/ },
        { file: /@cesium/ }
      ];

      return config;
    }
  }
};