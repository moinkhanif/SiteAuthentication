const webpack = require('webpack');

module.exports = {
  // ... other configuration
  module: {
    rules: [
      {
        test: /\.mjs$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: `/*! Build date: ${new Date().toLocaleString()} */`,
      raw: true,
    }),
  ],
};
