var path = require('path');
var webpack = require('webpack');

// Load .env
require('dotenv').config();

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.NODE_ENV !== 'production')),
  __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false')),
  SLACK_REDIRECT_URI: JSON.stringify(process.env.SLACK_REDIRECT_URI),
  SLACK_KEY: JSON.stringify(process.env.SLACK_KEY),
  URL: JSON.stringify(process.env.URL),
});

module.exports = {
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        include: path.join(__dirname, 'frontend')
      },
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.(png|jpg|svg)$/, loader: 'url-loader' }, // inline base64 URLs for <=8k images, direct URLs for the rest
      {
        test: /\.woff$/,
        loader: 'url-loader?limit=1&mimetype=application/font-woff&name=public/fonts/[name].[ext]'
      },

      // Excludes
      {
        // slug
        test: /unicode/,
        loader: 'ignore-loader',
      }
    ]
  },
  resolve: {
    root: path.join(__dirname, 'frontend'),
    // you can now require('file') instead of require('file.json')
    extensions: ['', '.js', '.json']
  },
  plugins: [
    definePlugin,
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!isomorphic-fetch'
    }),
    new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(en)$/)
  ],
  stats: {
    assets: false,
  },
};
