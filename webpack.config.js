const path = require("path");
const webpack = require("webpack");
const createExpoWebpackConfigAsync = require("@expo/webpack-config");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const Dotenv = require("dotenv-webpack");

const appDirectory = path.resolve(__dirname);
const { presets, plugins, env } = require(`${appDirectory}/babel.config.js`);

const getWebpackEnv = require("./webpack-env");
const dotEnv = getWebpackEnv();

const compileNodeModules = [
  // Add every react-native package that needs compiling
  "delivfree",
  "react-native-google-places-autocomplete",
].map((moduleName) => path.resolve(appDirectory, `node_modules/${moduleName}`));

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
        ["@babel/preset-env", { loose: true }],
        ["@babel/preset-typescript", { allowDeclareFields: true }],
        ...presets,
      ],
      plugins: [
        "lodash",
        "@babel/plugin-transform-runtime",
        "react-native-web",
        ["@babel/plugin-proposal-private-methods", { loose: true }],
        ...plugins,
      ],
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

// const imageLoaderConfiguration = {
//   test: /\.(png|jpe?g|gif)$/,
//   options: {
//     name: "static/media/[name].[hash:8].[ext]",
//     esModule: false,
//     scalings: { "@2x": 2, "@3x": 3 },
//   },
//   loader: "react-native-web-image-loader",
// };

const alias = {
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

// Expo CLI will await this method so you can optionally return a promise.
module.exports = async function (env, argv) {
  const mode = process.env.MODE || "development";
  const config = await createExpoWebpackConfigAsync(
    {
      ...env,
      mode,
    },
    argv
  );

  config.entry = ["babel-polyfill", path.join(__dirname, "index.web.js")];
  // config.optimization.minimize = config.mode === "production";
  config.output = {
    path: path.resolve(appDirectory, "dist"),
    publicPath: "/",
    filename: "chunk.[name].[contenthash].js",
    chunkFilename: "chunk.[name].[contenthash].js",
  };
  config.module.rules = [
    ...config.module.rules,
    babelLoaderConfiguration,
    svgLoaderConfiguration,
    {
      test: /\.(js|jsx)$/,
      resolve: {
        fullySpecified: false,
      },
    },
  ];

  Object.entries(alias).forEach(([library, libPath]) => {
    config.resolve.alias[library] = libPath;
  });

  if (config.mode === "development") {
    config.devServer.compress = false;
  }

  // const definePluginIndex = config.plugins.findIndex((plugin) => {
  //   return plugin instanceof webpack.DefinePlugin;
  // });

  // const definePlugin = new webpack.DefinePlugin({
  //   __DEV__: JSON.stringify(mode === "development"),
  //   "process.env": JSON.stringify({
  //     ...process.env,
  //     NODE_ENV: process.env.MODE,
  //   }),
  // });

  // if (definePluginIndex === -1) {
  //   config.plugins.push(definePlugin);
  // } else {
  //   config.plugins[definePluginIndex] = definePlugin;
  // }

  const plugins = [
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
  ];

  if (config.mode === "production") {
    // const prodPlugins = [new BundleAnalyzerPlugin()];
    // plugins.push(...prodPlugins);
  }

  config.plugins.push(...plugins);

  return config;
};
