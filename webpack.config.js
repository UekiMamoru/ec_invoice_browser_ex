const path = require('path');
var webpack = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");
module.exports = {

    //エントリポイントのJavaScript
    entry: {

        'pdf': "./dev/js/pdf.js",
        'pdfmerger': "./dev/js/pdfmerger.js",
        // "content": "./dev/js/content/main/content.js",
        "worker": "./dev/js/background/worker.js",

        "option": "./dev/ts/react/main/option.tsx",
        "history-result": "./dev/ts/react/main/history-result.tsx",
        "content": "./dev/ts/react/main/amazon/amazonProductBuyHistory.tsx",
        "action/popup": "./dev/ts/react/main/popup.tsx",


        'ttttt': "./dev/js/tmp/t.js",
    },
    devtool: false,
    mode: "development",
    output: {
        filename: "[name].js",
        // path: path.resolve(__dirname, './public/js/'),
        //出力先のフォルダ
        path: path.resolve(path.join(__dirname, "dist"), './js/'),
        // //出力先のファイル名
        // filename: 'contents_script.js'
        // publicPath: "chrome-extension://epmlcnekeghifeojgdkkcodlgalkegdk/js/"
    },
    module: {
        rules: [
            {
                // 拡張子 .ts もしくは .tsx の場合
                test: /\.tsx?$/,
                // TypeScript をコンパイルする
                use: "ts-loader"
            }
            , {
                test: /\.(sass|scss|css)$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.jsx$/,
                use: "esbuild-loader"
            }
        ]
    },
    // import 文で .ts や .tsx ファイルを解決するため
    resolve: {
        extensions: [".ts", ".tsx", ".js", "jsx", ".json"]
    },
    // ES5(IE11等)向けの指定（webpack 5以上で必要）

    devServer: {
        contentBase: "./dist",
    },

    plugins: [
        new CopyPlugin({
            patterns: [
                {from: "public", to: "../"},

            ],
        }),
    ],
};