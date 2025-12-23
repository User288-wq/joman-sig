// craco.config.js
const webpack = require("webpack");

module.exports = {
  webpack: {
    configure: (config) => {
      config.resolve.fallback = {
        zlib: require.resolve("browserify-zlib"),
        https: require.resolve("https-browserify"),
        http: require.resolve("stream-http"),
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
        assert: require.resolve("assert/"),
        url: require.resolve("url/"),
        buffer: require.resolve("buffer/"),
        fs: false,
        path: false,
        process: require.resolve("process/browser")
      };

      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ["buffer", "Buffer"],
          process: "process/browser",
        })
      );

      return config;
    },
  },
};
