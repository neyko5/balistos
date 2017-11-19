'use strict';

const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: [
    path.join(__dirname, '../app.js')
  ],
  output: {
    path: path.join(__dirname, '../dist/'),
    filename: '[name].js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  externals: [
    nodeExternals()
  ],
  module: {
    loaders: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          query: {
            "presets": ["latest"],
            "plugins": ['transform-regenerator', 'transform-runtime']
          }
        }, 
        {
          test: /\.json?$/,
          loader: 'json-loader',
          exclude: /node_modules/,
        }
      ]
  },
  target: 'node'
};