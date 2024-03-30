const path = require("path");
const webpack = require("webpack");
const createExpoWebpackConfigAsync = require("@expo/webpack-config");

const appDirectory = path.resolve(__dirname);
const { presets, plugins, env } = require(`${appDirectory}/babel.config.js`);

const getWebpackEnv = require("./webpack-env");
const dotEnv = getWebpackEnv();

const compileNodeModules = [
  // Add every react-native package that needs compiling
  "delivfree",
].map((moduleName) => path.resolve(appDirectory, `node_modules/${moduleName}`));

const babelLoaderConfiguration = {
  test: /\.(js|ts|tsx)$/,
  // Add every directory that needs to be compiled by Babel during the build.
  include: [
    // path.resolve(__dirname, "App.js"), // Entry to your application
    // path.resolve(__dirname, "app"),
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
  const config = await createExpoWebpackConfigAsync(
    { ...env, mode: "development" },
    argv
  );

  config.entry = ["babel-polyfill", path.join(__dirname, "index.web.js")];
  // If you want to add a new alias to the config.

  Object.entries(alias).forEach(([library, libPath]) => {
    config.resolve.alias[library] = libPath;
  });

  // Maybe you want to turn off compression in dev mode.
  if (config.mode === "development") {
    config.devServer.compress = false;
  }

  config.module.rules = [
    ...config.module.rules,
    babelLoaderConfiguration,
    // imageLoaderConfiguration,
    svgLoaderConfiguration,
    {
      test: /\.(js|jsx)$/,
      resolve: {
        fullySpecified: false,
      },
    },
  ];

  const definePluginIndex = config.plugins.findIndex((plugin) => {
    return plugin instanceof webpack.DefinePlugin;
  });
  const definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(true),
    "process.env": JSON.stringify(dotEnv),
  });

  if (definePluginIndex === -1) {
    config.plugins.push(definePlugin);
  } else {
    config.plugins[definePluginIndex] = definePlugin;
  }

  // module: {
  //   rules: [
  //     babelLoaderConfiguration,
  //     imageLoaderConfiguration,
  //     svgLoaderConfiguration,
  //     {
  //       test: /\.(js|jsx)$/,
  //       resolve: {
  //         fullySpecified: false,
  //       },
  //     },
  //   ],
  // },

  // Or prevent minimizing the bundle when you build.
  // if (config.mode === "production") {
  //   config.optimization.minimize = false
  // }

  // Finally return the new config for the CLI to use.
  return config;
};
