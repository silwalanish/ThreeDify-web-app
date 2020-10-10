const path = require('path');
const dotenv = require('dotenv');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = () => {
  const env = dotenv.config().parsed || { API_URL: process.env.API_URL };

  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    entry: ['./src/index.js', './src/Themes/App.scss'],
    mode: process.env.NODE_ENV || 'development',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          options: { presets: ['@babel/env'] },
        },
        {
          test: /\.s?css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
      ],
    },
    resolve: { extensions: ['*', '.js', '.jsx'] },
    output: {
      path: path.resolve(__dirname, 'dist/'),
      publicPath: '/dist/',
      filename: 'bundle.js',
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          styles: {
            name: 'styles',
            test: /\.s?css$/,
            chunks: 'all',
            enforce: true,
          },
        },
      },
    },
    plugins: [
      new webpack.DefinePlugin(envKeys),
      new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
      new OptimizeCSSAssetsPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      new HtmlWebpackPlugin({
        inject: false,
        title: 'ThreeDify',
        scriptLoading: 'defer',
        filename: path.join(__dirname, 'public', 'index.html'),
        template: path.join(__dirname, 'src', 'index.html'),
      }),
    ],
  };
};
