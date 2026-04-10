'use strict';

/* eslint-disable @typescript-eslint/no-var-requires */
require('dotenv').config();

const path = require('path');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const DotEnv = require('dotenv-webpack');
/* eslint-enable @typescript-eslint/no-var-requires */

module.exports = (args, env) => {
  const port = process.env.PORT || args.port || 3000;
  const isProduction = env.mode === 'production';
  const isDevelopment = !isProduction;

  const plugins = [
    new DotEnv(),
    new HtmlPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'),
      filename: 'index.html',
      publicPath: '/',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src', 'assets', 'manifests'),
          to: path.resolve(__dirname, 'build'),
        },
      ],
    }),
  ];
  if (isDevelopment) {
    plugins.push(new ReactRefreshPlugin());
  }
  if (isProduction) {
    plugins.push(new MiniCssExtractPlugin({
      filename: 'static/css/[contenthash].css',
    }));
  }

  const babelLoaderOptions = {
    presets: [
      '@babel/preset-env',
      '@babel/preset-react',
    ],
  };
  if (isDevelopment) {
    babelLoaderOptions['plugins'] = [
      'react-refresh/babel',
    ];
  }

  const cssLoaders = ({modules}) => [
    isDevelopment ? 'style-loader': MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: modules ? {
        esModule: true,
        modules: {localIdentName: isDevelopment ?
          '[local]_[hash:base64:4]':
          '[hash:base64:8]',
        },
        sourceMap: isDevelopment,
      } : {},
    },
    isProduction && 'postcss-loader',
    {
      loader: 'sass-loader',
      options: {implementation: require('sass'), sourceMap: isDevelopment},
    },
  ].filter(Boolean);

  const devtool = isProduction ?
    false :
    'eval-cheap-module-source-map';

  return {
    mode: env.mode,
    context: __dirname,
    target: ['web', 'es5'],
    entry: {
      main: path.resolve(__dirname, 'src', 'index.tsx'),
    },
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: isDevelopment ?
        'static/js/[name].js' :
        'static/js/[contenthash].js',
      publicPath: '/',
    },
    plugins,
    module: {
      rules: [
        {
          test: /\.tsx?/,
          include: path.resolve(__dirname, 'src'),
          use: [
            {
              loader: 'babel-loader',
              options: babelLoaderOptions,
            },
            'ts-loader',
          ],
        },
        {
          test: /\.scss/,
          include: path.resolve(__dirname, 'src'),
          exclude: /\.module\.scss/,
          use: cssLoaders({modules: false}),
        },
        {
          test: /\.module\.scss/,
          include: path.resolve(__dirname, 'src'),
          use: cssLoaders({modules: true}),
        },
        {
          test: /\.ttf/,
          include: path.resolve(__dirname, 'src', 'assets', 'fonts'),
          type: 'asset/resource',
          generator: {
            filename: isDevelopment ?
              'static/fonts/[name][ext][query]' :
              'static/fonts/[hash][ext][query]',
          },
        },
        {
          test: /\.(png|svg)$/,
          include: path.resolve(__dirname, 'src', 'assets', 'images'),
          type: 'asset/resource',
          generator: {
            filename: isDevelopment ?
              'static/img/[name][ext][query]' :
              'static/img/[hash][ext][query]',
          },
        },
      ],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      extensions: ['.tsx', '.ts', '.js'],
    },
    devtool,
    stats: 'minimal',
    devServer: {
      port: port,
      hot: true,
      historyApiFallback: true,
    },
  };
};
