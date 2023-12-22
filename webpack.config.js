const path = require('path');

module.exports = {

    //エントリポイントのJavaScript
    entry: {

        'pdf': "./dev/js/pdf.js",
        "content": "./dev/js/content/main/content.js",
        "worker": "./dev/js/background/worker.js",

        "option/invoice-history": "./dev/ts/react/main/ec-invoice-history.tsx",
        "action/popup": "./dev/ts/react/main/popup.tsx"
    },
    devtool: false,
    mode: "development",
    output: {
        filename: "[name].js",
        // path: path.resolve(__dirname, './public/js/'),
        //出力先のフォルダ
        path: path.resolve(__dirname, './js/'),
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
        ]
    },
    // import 文で .ts や .tsx ファイルを解決するため
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },
    // ES5(IE11等)向けの指定（webpack 5以上で必要）


};