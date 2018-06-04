const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin')/* favicons */

module.exports = {
  entry: './scripts/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[hash]-bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [path.resolve(__dirname, "scripts")],
        loader: "babel-loader",
        options: {
          presets: ["es2015"]
          /* newer option -> use babel-preset-env */
        }
        /* include babel-loader and preset options for ES2015 if needed ! */
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'images/[hash]-[name].[ext]',
        }
      },
      {
        test: /\.(eot|otf|ttf|woff|woff2)$/,
        loader: 'file-loader',
      },
    ]
  },
  /* resolve makes it easier for JS files to look for style files:
     import css from "Styles/filename.scss" and for css files to find
     images, fonts etc */
  resolve: {
    alias: {
      Styles: path.resolve(__dirname, 'styles/'),
      Images: path.resolve(__dirname, 'img/'),
      Fonts: path.resolve(__dirname, 'fonts/')
    }
  },
  plugins: [
    new CleanWebpackPlugin([path.resolve(__dirname, 'dist')]),
    new HtmlWebpackPlugin({
      title: 'Brussels Bikecounter',
      template: 'index.html',
      filename: 'index.html'
    }),
    new webpack.DefinePlugin({
      API_URL: JSON.stringify("https://bikecounter-api.herokuapp.com"),
    }),
    new WebappWebpackPlugin('./favicon.png')
  ]
};
