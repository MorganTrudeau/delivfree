const path = require("path");

const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const getWebpackEnv = require("./webpack-env");

const dotEnv = getWebpackEnv();

const appDirectory = path.resolve(__dirname);
const { presets, plugins, env } = require(`${appDirectory}/babel.config.js`);

const compileNodeModules = [
  // Add every react-native package that needs compiling
  "delivfree",
  "react-native-google-places-autocomplete",
  "@expo-google-fonts",
  "@react-native-community/push-notification-ios",
  "react-native-calendars",
  "react-native-chart-kit",
  "react-native-circular-progress",
  "react-native-phone-number-input",
  "react-native-swipe-gestures",
  "@expo/vector-icons",
  "functions/src",
  "@expo-google-fonts",
  "expo-asset",
  "react-native-draggable-flatlist",
].map((moduleName) => path.resolve(appDirectory, `node_modules/${moduleName}`));

const alias = {
  "react-native$": "react-native-web",
  "@gorhom/bottom-sheet": path.join(
    __dirname,
    "app/web/modules/@gorhom/bottom-sheet"
  ),
  "@react-native-firebase/auth": path.join(
    __dirname,
    "app/web/modules/firebase/auth"
  ),
  "@react-native-firebase/analytics": path.join(
    __dirname,
    "app/web/modules/firebase/analytics"
  ),
  "@react-native-firebase/firestore": path.join(
    __dirname,
    "app/web/modules/firebase/firestore"
  ),
  "@react-native-firebase/crashlytics": path.join(
    __dirname,
    "app/web/modules/firebase/crashlytics"
  ),
  "@react-native-firebase/messaging": path.join(
    __dirname,
    "app/web/modules/firebase/messaging"
  ),
  "@react-native-firebase/functions": path.join(
    __dirname,
    "app/web/modules/firebase/functions"
  ),
  "@react-native-firebase/storage": path.join(
    __dirname,
    "app/web/modules/firebase/storage"
  ),
  "react-native-push-notification": path.join(
    __dirname,
    "app/web/modules/react-native-push-notification"
  ),
  "react-native-config": path.join(
    __dirname,
    "app/web/modules/react-native-config"
  ),
  "react-native-share": path.join(
    __dirname,
    "app/web/modules/react-native-share"
  ),
  "react-native-fast-image": path.join(
    __dirname,
    "app/web/modules/react-native-fast-image"
  ),
  "react-native-image-crop-picker": path.join(
    __dirname,
    "app/web/modules/react-native-image-crop-picker"
  ),
  "react-native-linear-gradient": "react-native-web-linear-gradient",
};

const babelLoaderConfiguration = {
  test: /\.(js|ts|tsx)$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    path.resolve(__dirname, "index.web.js"), // Entry to your application
    path.resolve(__dirname, "app"),
    ...compileNodeModules,
  ],
  use: {
    loader: "babel-loader",
    options: {
      cacheDirectory: true,
      presets: [
        ["@babel/preset-typescript", { allowDeclareFields: true }],
        ...presets,
      ],
      plugins: ["lodash", "react-native-web", ...plugins],
      env,
      sourceType: "unambiguous",
    },
  },
};

const svgLoaderConfiguration = {
  test: /\.svg$/,
  use: [
    {
      loader: "@svgr/webpack",
    },
  ],
};

const imageLoaderConfiguration = {
  test: /\.(png|jpe?g|gif)$/,
  options: {
    name: "static/media/[name].[hash:8].[ext]",
    esModule: false,
    scalings: { "@2x": 2, "@3x": 3 },
  },
  loader: "react-native-web-image-loader",
};

module.exports = {
  target: ["web", "es5"],
  devServer: { historyApiFallback: true },
  entry: ["babel-polyfill", path.join(__dirname, "index.web.js")],
  output: {
    path: path.resolve(appDirectory, "dist"),
    publicPath: "/",
    filename: "chunk.[name].[contenthash].js",
    chunkFilename: "chunk.[name].[contenthash].js",
  },
  // devtool: 'eval-source-map',
  resolve: {
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      vm: require.resolve("vm-browserify"),
      stream: require.resolve("stream-browserify"),
    },
    extensions: [
      ".web.tsx",
      ".web.ts",
      ".tsx",
      ".ts",
      ".web.js",
      ".js",
      ".jsx",
      ".json",
      ".png",
    ],
    alias,
  },
  module: {
    rules: [
      babelLoaderConfiguration,
      imageLoaderConfiguration,
      svgLoaderConfiguration,
      {
        test: /\.(js|jsx)$/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.mjs$/,
        resolve: {
          fullySpecified: false,
        },
        include: /node_modules/,
        type: "javascript/auto",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ],
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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      // See: https://github.com/necolas/react-native-web/issues/349
      __DEV__: JSON.stringify(true),
      process: { env: JSON.stringify(dotEnv) },
    }),
    new webpack.EnvironmentPlugin({ JEST_WORKER_ID: null }),
  ],
};
