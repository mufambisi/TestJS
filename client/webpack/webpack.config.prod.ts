import { BundleAnalyzerPlugin } from "webpack-bundle-analyzer";

import config from "./webpack.config";

const ANALYZE =
  process.argv.includes("--analyze") || process.argv.includes("-a");

config.mode = "production";

config.devtool = "source-map";

config.performance = {
  assetFilter: (f) => !/tal-assets/.test(f),
};

if (ANALYZE) {
  config.plugins?.push(new BundleAnalyzerPlugin());
}

export default config;
