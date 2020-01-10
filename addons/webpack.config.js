var supportedAddons = ["PseudoCode_Console", "Media_Recorder"];

var entry = {};

supportedAddons.forEach(function (element) {
  entry[element] = "./" + element + "/src_webpack/presenter.jsm";
});

var debug = false;
var webpack = require('webpack');
var path = require('path');



module.exports = {
  context: __dirname,
  devtool: debug ? "inline-sourcemap" : false,
  entry: entry,
  output: {
    path: __dirname,
    filename: "[name]/src/presenter.js"
  },
  plugins: debug ? [] : [
  ],
  module: {
    rules: [
      {
        test: /\.jsm$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['babel-preset-env'],
            plugins: [
                require('babel-plugin-transform-remove-strict-mode'),
                "transform-object-rest-spread",
                "transform-class-properties"
            ]
          }
        }

      }
    ]
  }
};

