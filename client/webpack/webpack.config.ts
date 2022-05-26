import { Configuration } from "webpack";
import { TalAppProvider } from "@origin-digital/webpack-plugin-tal-develop-fs";

import { getAppId, getManifestList, getWidgetVersions } from "../config/utils";

import CONFIG_LOCAL from "../tal/local.json";
import CONFIG_STAGING from "../tal/staging.json";
import CONFIG_PROD from "../tal/prod.json";

const APP_ID = getAppId();
const manifestList = getManifestList().map((filenameMatch) => {
  const [manifest, name] = filenameMatch;
  return {
    name,
    manifest: require(`../config/${manifest}`),
  };
});

const BUILD_NUMBER = process.env.BUILD_NUMBER || "0.0.0";

const config: Configuration = {
  entry: [
    require.resolve("../src/setup.ts"),
    require.resolve("../src/index.tsx"),
  ],
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jsx", ".json", ".svg"],
    modules: ["client", "node_modules"],
  },
  output: { filename: "[name].[chunkhash:8].js", publicPath: "/" },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: { loader: "babel-loader" },
      },
    ],
  },
  plugins: [
    new TalAppProvider(
      [
        /^vendors_main\.[0-9a-zA-Z]+?\.js/,
        /^origin_main\.[0-9a-zA-Z]+?\.js/,
        /^main\.[0-9a-zA-Z]+?\.js/,
      ],
      {
        pages: manifestList,
        buildId: `b${BUILD_NUMBER}; ${new Date().toISOString()}; ${getWidgetVersions()}`,
        name: `${APP_ID}assets`,
        manifest: APP_ID,
        env: "local",
        envConfig: {
          local: CONFIG_LOCAL,
          staging: CONFIG_STAGING,
          prod: CONFIG_PROD,
        },
      }
    ),
  ],
  externals: {
    "styled-components": "styled",
    react: "React",
    "react-dom": "ReactDOM",
  },
  stats: {
    excludeAssets: /tal-assets/,
  },
  optimization: {
    splitChunks: {
      automaticNameDelimiter: "_",
      chunks: "all",
      cacheGroups: {
        // separate out origin digital code to its own bundle
        origin_main: {
          test: /[\\/]node_modules[\\/](@origin-digital)[\\/]/,
          name: "origin_main",
        },
      },
    },
  },
};

export default config;
