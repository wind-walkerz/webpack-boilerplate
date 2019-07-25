const path = require('path')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const fs = require('fs')

const config = {
  entry: './src/scripts/main.js',
  devtool: 'eval',
  output: {
    filename: './[name].[hash].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: './'
  },
  resolve: {
    extensions: ['*', '.js', '.twig', '.json']
  },
  module: {
    rules: [
      {
        test: /\.(scss|css)?$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
          'import-glob-loader'
        ]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: ['babel-loader']
      },

      {
        test: /\.twig$/,
        exclude: /node_modules/,
        use: ['twig-loader']
      },

      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]',
            outputPath: './assets/images',
          }
        }]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]',
            outputPath: './assets/media'
          }
        }]

      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]',
            outputPath: 'assets/fonts',
          }
        }]
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),

    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      _: 'lodash'
    }),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../src/app/app.twig'),
      cache: true
    }),

    new MiniCssExtractPlugin({
      filename: './[name].[hash].css',
      chunkFilename: '[id].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),
    //
    // new CopyWebpackPlugin([
    //   {from: './src/assets/fonts', to: './assets/fonts'}
    // ])
  ]
}

const templateFiles = fs.readdirSync(path.resolve(__dirname, '../src/app/pages'))

templateFiles.map(item => {
  // Split names and extension
  const parts = item.split('.')
  const name = parts[0]
  const extension = parts[1]

  // Create new HTMLWebpackPlugin with options
  config.plugins.push(new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `../src/app/pages/${name}.${extension}`),
      cache: true
    })
  )
})

module.exports = config


