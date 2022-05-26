import config from "./webpack.config.local";

const HOST = process.env.STUB_HOST || "localhost";
const PORT = process.env.STUB_HTTP_PORT || 3004;

config.devtool = "cheap-module-eval-source-map";

(config as any).devServer = {
  disableHostCheck: true,
  headers: { "access-control-allow-origin": "*" },
  historyApiFallback: true,
  host: "localhost",
  open: true,
  port: 8080,
  proxy: {
    "/api/*": {
      changeOrigin: true,
      target: `http://${HOST}:${PORT}`,
    },
    "/my-account/solar-usage/api/graphql": {
      changeOrigin: true,
      target: `http://${HOST}:${PORT}`,
    },
    "/v1/lpg/graphql": {
      changeOrigin: true,
      target: `http://${HOST}:${PORT}`,
    },
    "/my-account/vpp/api/*": {
      changeOrigin: true,
      target: `http://${HOST}:${PORT}`,
    },
    "/my-account/ev/api/*": {
      changeOrigin: true,
      target: `http://${HOST}:${PORT}`,
    },
  },
};

export default config;
