const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const ROOT_PATH = path.resolve(__dirname)
const BUILD_PATH = path.resolve(ROOT_PATH, 'dist')

module.exports = {
  entry: {
    /* eslint-disable-next-line quote-props */
    'maeco': './src/js/main.js',
    'maeco.all': './src/js/main.all.js'
  },
  output: {
    path: BUILD_PATH,
    filename: '[name].min.js',
    library: 'Maeco',
    libraryTarget: 'umd'
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'public/', to: './' }
      ]
    })
  ],
  devServer: {
    contentBase: BUILD_PATH,
    port: 8080
  }
}
