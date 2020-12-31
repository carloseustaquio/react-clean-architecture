const path = require("path");
const { DefinePlugin } = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/main/index.tsx",
  output: {
    path: path.resolve(__dirname, "public/js"),
    publicPath: "/public/js",
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".scss"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
          {
            loader: "sass-loader",
          },
        ],
      },
    ],
  },
  devServer: {
    contentBase: "./public",
    writeToDisk: true,
    historyApiFallback: true,
  },
  externals: {
    // using these dependency as external dependencies from CDN (check index.html scripts)
    react: "React",
    "react-dom": "ReactDOM",
  },
  plugins: [
    new CleanWebpackPlugin(),
    new DefinePlugin({
      "process.env.API_URL": JSON.stringify(
        "https://fordevs.herokuapp.com/api"
      ),
    }),
  ],
};
