// Generated using webpack-cli https://github.com/webpack/webpack-cli

import path from "path";

const isProduction = process.env.NODE_ENV == "production";

import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const config = {
  entry: path.join(__dirname, "src/app.js"),
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
      { exclude: "/node_modules/" },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
};

const Config = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};

export default Config;
