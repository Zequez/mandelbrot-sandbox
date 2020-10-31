const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");

module.exports = {
  entry: "./src/bootstrap.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bootstrap.js",
  },
  mode: "development",
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
  ],
};
