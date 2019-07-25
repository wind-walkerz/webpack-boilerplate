const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const glob = require('glob')
const fs = require('fs')

function resolve (dir) {
  return path.join(__dirname, '.', dir)
}

// --------------------------------------------------template
// Our function that generates our html plugins
function generateHtmlPlugins (templateDir) {
  // Read files in template directory
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir))
  return templateFiles.map(item => {
    // Split names and extension
    const parts = item.split('.')
    const name = parts[0]
    const extension = parts[1]
    // Create new HTMLWebpackPlugin with options
    return new HtmlWebpackPlugin({
      filename: `${name}.html`,
      template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
      cache: true
    })
  })
}

const htmlPlugins = generateHtmlPlugins('./src/template/pages')

// -------------------------------------------------- javascript
function generateJavascript (templateDir) {
  var newItem = {}
  // Read files in template directory
  const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir))
  templateFiles.forEach(item => {
    // Split names and extension
    const parts = item.split('.')
    const name = parts[0]
    const extension = parts[1]

    newItem[name] = `${templateDir}/${name}.${extension}`
  })
  return newItem
}

const javascriptEntry = generateJavascript('./src/scripts/bootstrap')

// --------------------------------------------- run command
module.exports = {
  entry: javascriptEntry,
  devtool: 'eval',
  output: {
    filename: './[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: './'
  },
  resolve: {
    extensions: ['.js', '.twig', '.json'],
    alias: {
      'src': resolve('src'),
      'assets': resolve('src/assets')
    }
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
            outputPath: './images',
          }
        }]
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]',
            outputPath: './media'
          }
        }]

      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[hash].[ext]',
            outputPath: './fonts',
            publicPath: '../fonts'
          }
        }]
      }
    ]
  },
  plugins: [

    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      _: 'lodash'
    }),

    new MiniCssExtractPlugin({
      filename: './[name].bundle.css',
      chunkFilename: '[id].css',
      ignoreOrder: false, // Enable to remove warnings about conflicting order
    }),

    new CopyWebpackPlugin([
      {from: './src/scripts/public-scripts', to: './public-scripts'}
    ]),
    new CopyWebpackPlugin([
      {from: './src/assets', to: './'}
    ])
  ]
    .concat(htmlPlugins)
}
