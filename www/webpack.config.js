const { merge } = require("webpack-merge");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const path = require("path");

let config = {
  entry: "./src/bootstrap.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bootstrap.js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ["babel-loader", "ts-loader"],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".wasm"],
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    alias: {
      "~icons": path.resolve(
        __dirname,
        "node_modules/@fortawesome/fontawesome-free/svgs"
      ),
      "@": path.resolve(".", "src"),
      "@@": path.resolve("."),
      types: path.resolve(".", "types"),
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles.css",
      chunkFilename: "styles.css",
    }),
    new HtmlWebPackPlugin({
      template: "src/index.html",
      filename: "index.html",
    }),
    new FaviconsWebpackPlugin({
      logo: "./src/icon3.png",
      mode: "light",
    }),
  ],
};

if (process.env.NODE_ENV === "production") {
  config = merge(config, {
    mode: "production",
    devtool: "source-map",
  });
}

module.exports = config;
