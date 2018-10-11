const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: './src/scripts/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: require.resolve('snapsvg/dist/snap.svg.js'),
        use: 'imports-loader?this=>window,fix=>module.exports=0',
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          // 'style-loader', // for development
          MiniCssExtractPlugin.loader, // for production
          { loader: 'css-loader', options: { importLoaders: 1, url: false } },
          'postcss-loader',
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'bundle.css',
    }),
  ],
  resolve: {
    alias: {
      snapsvg: 'snapsvg/dist/snap.svg.js',
    },
    extensions: ['.js', '.jsx', '.json'],
  },
  devServer: {
    contentBase: './dist',
    // host: '192.168.101.111',
    port: 8080,
    open: true,
  },
};
