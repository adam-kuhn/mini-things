const path = require('path')

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'client/index.js'),
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'public')
  }
}
