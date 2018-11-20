const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const common = require('./webpack.common.js');

module.exports = merge(common, {
  module: {
    rules: [
      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader", // translates CSS into CommonJS
          },
          {
            loader: "sass-loader", // compiles Sass to CSS
            options: {/* also use "~" in prefix for node_modules stylesheets */
              includePaths: [path.resolve(__dirname, "styles")],
              implementation: require("dart-sass")
            }
          }]
      }]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new UglifyJSPlugin({
      parallel: 4
    }),
    new webpack.DefinePlugin({
      /* Important ! In prod, there is no need for a specific
         port. This value should be http://localhost:3000 in dev to take
         advantage of the auto-reloading webpack server */
      API_URL: JSON.stringify(""),
    })

  ]
});
