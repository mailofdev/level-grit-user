// webpack.config.js
module.exports = {
  // ... your config
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
        exclude: /node_modules\/@tensorflow-models/,
      },
    ],
  },
};
