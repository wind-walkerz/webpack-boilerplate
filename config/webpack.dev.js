const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require('path')

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = merge(common, {
  devtool: 'eval',
  mode: 'development',
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
  plugins: [
    // new BundleAnalyzerPlugin()
  ]
})
