const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')

module.exports = merge(common, {
  devtool: 'eval',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 4500,
    publicPath: '/',
    historyApiFallback: true,
    watchContentBase: true,
    disableHostCheck: true
  },
  performance: {
    hints: false
  },
})
