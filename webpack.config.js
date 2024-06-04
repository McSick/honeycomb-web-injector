const path = require('path');

module.exports = {
  entry: './src/tracing.js',
  output: {
    filename: 'tracing.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Tracing',
    libraryTarget: 'umd'
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
};
