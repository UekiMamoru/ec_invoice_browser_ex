const path = require('path');

module.exports = {

	//エントリポイントのJavaScript
	entry: {

        'pdf':"./dev/js/pdf.js"
    },
    devtool: false,
    mode:"development",
    output: {
        filename: "[name].js",
        // path: path.resolve(__dirname, './public/js/'),
        //出力先のフォルダ
        path: path.resolve(__dirname, './js/'),
        // //出力先のファイル名
        // filename: 'contents_script.js'
        publicPath: "chrome-extension://lkfnndikpoohannechljejlpbeigpmpo/js/"
    },

};