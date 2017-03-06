const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './client/index.html',
  filename: 'index.html',
  inject: 'body'
});

const myPlugin = require('./myPlugin.js');

module.exports = {
  entry: './client/index.js',
  resolve: {
    modules: [
      path.resolve(__dirname),
      path.resolve(__dirname, "client"),
      "node_modules"
    ]
  },
  output: {
    path: path.resolve('dist'),
    filename: 'index_bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          plugins: [myPlugin],
        },
      },
    ],
  },
  plugins: [HtmlWebpackPluginConfig],
}
