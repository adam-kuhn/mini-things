const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, './client/index.js'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './public')
  },
  plugins: [
    new CopyPlugin([
      {
        from: path.join(__dirname, './node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff2'),
        to: path.join(__dirname, './public/style/webfonts')
      },
      {
        from: path.join(__dirname, './node_modules/@fortawesome/fontawesome-free/webfonts/fa-solid-900.woff'),
        to: path.join(__dirname, './public/style/webfonts')
      }
    ])
  ]
}
