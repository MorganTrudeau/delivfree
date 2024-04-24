const webpackConfig = require("./webpack.config");

const path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const getWebpackEnv = require("./webpack-env");
const dotEnv = getWebpackEnv();

module.exports = {
  ...webpackConfig,
  mode: "production",
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public",
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "index.html"),
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.DefinePlugin({
      // See: https://github.com/necolas/react-native-web/issues/349
      __DEV__: JSON.stringify(false),
      process: {
        env: JSON.stringify({
          ...dotEnv,
          NODE_ENV: JSON.stringify("production"),
        }),
      },
    }),
    new BundleAnalyzerPlugin(),
  ],
};
