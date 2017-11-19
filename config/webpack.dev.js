'use strict';

const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const commonConfig = require('./webpack.common.js');
const ReloadServerPlugin = require('reload-server-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports =  webpackMerge(commonConfig, {
  watch: true,
  output: {
    path: path.join(__dirname, '../dev/'),
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new ReloadServerPlugin({
      script: "dev/main.js",
    }),
    new Dotenv({
      path: path.join(__dirname, '../.env'),
      safe: true
    })
  ]
});