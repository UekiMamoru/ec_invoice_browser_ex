const path = require('path');

module.exports = {

    //エントリポイントのJavaScript
    entry: {

        'pdf': "./dev/js/pdf.js",
        "content": "./dev/js/content/main/content.js",
        "worker": "./dev/js/background/worker.js"
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

};