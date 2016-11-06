var ExtractTextPlugin = require('extract-text-webpack-plugin');
var StyleLintPlugin = require('stylelint-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
let webpack = require('webpack');

module.exports = {
  entry: [
    __dirname + '/src/app.js',
    __dirname + '/src/styles.less'
  ],
  output: {
    path: __dirname + '/public',
    filename: "bundle.js"
  },

  devtool: 'source-map',
  module: {
    preLoaders: [
      {test: /\.js$/, loader: "eslint-loader", exclude: /node_modules/}
    ],
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
        presets: ['es2015']
      }
    },
    {
      test: /\.less$/,
      exclude : /node_modules/,
      loader: ExtractTextPlugin.extract('style', 'css!less')
    },
    { test: /\.handlebars$/, loader: "handlebars-loader" },
    {
      test: /\.(html|png|jpg|svg|ttf|eot|woff|woff2)$/,
      exclude: /node_modules/,
      loader: 'file?name=[name].[ext]'
    }]
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new StyleLintPlugin({
      configFile: '.stylelintrc',
      files: '**/*.less',
      failOnError: false,
    }),
    new CopyWebpackPlugin([
      { from: 'src/static' }
    ]),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    contentBase: './public',
    historyApiFallback: true,
    hot: true,
    inline: true
  }
};
