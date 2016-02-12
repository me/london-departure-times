var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");


module.exports = {
  entry: {
    app: [
      "./assets/src/index.js"
    ]
  },
  output: {
      path: "./assets/dist",
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
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
            'file?hash=sha512&digest=hex&name=[hash].[ext]',
            'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
    }
    ]
  },
  plugins: [
      new ExtractTextPlugin("[name].css", {allChunks: true}),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ],
  externals: {
    "google": "google"
  }
};
