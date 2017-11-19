'use strict';

const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');

module.exports = webpackMerge(commonConfig, {
  output: {
    path: path.join(__dirname, '../dist/'),
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: true
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.SECRET': JSON.stringify(process.env.SECRET),
      'process.env.DB_NAME': JSON.stringify(process.env.DB_NAME),
      'process.env.DB_USER': JSON.stringify(process.env.DB_USER),
      'process.env.DB_PASS': JSON.stringify(process.env.DB_PASS),
      'process.env.DB_HOST': JSON.stringify(process.env.DB_HOST)
    })
  ],
});