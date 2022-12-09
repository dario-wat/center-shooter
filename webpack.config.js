const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  output: {
    path: __dirname + "dist",
    filename: "bundle.js",
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  // devServer: {
  //   contentBase: './dist',
  // },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: /node_modules/,
        use: [
          { loader: "ts-loader" }
        ]
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          "style-loader",
          "css-loader"
        ]
      },
      {
        test: /\.mp3$/,
        exclude: /node_modules/,
        use: [
          { loader: 'file-loader' }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|jp2|webp)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
      },
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ],
}