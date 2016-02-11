var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  entry: {
    app: [
      "./assets/src/index.js"
    ]
  },
  output: {
      path: "./assets/",
      filename: "[name].js",
      chunkFilename: "[id].js"
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("style-loader", "css!sass")
      }
    ]
  },
   plugins: [
      new ExtractTextPlugin("[name].css", {allChunks: true})
  ]
};
