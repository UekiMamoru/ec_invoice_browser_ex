const EC_KEY_PREFIX = "ec_"
chrome.runtime.onMessage.addListener(
    (message, sender, callback) => {
        if (message.hasOwnProperty("type")&& message.type==="get-ec-pdf-data") {
            let ecName = message.ecName;
            let key = `${EC_KEY_PREFIX}${ecName}`;
            let list = [key];
            let orderNumber = message.orderNumber
            let resultData = {data: null, state: false}
            chrome.storage.local.get(list, (result) => {
                let data = result[key];
                // もしデータがなければ配列にする
                if (!data) {
                    data = {};
                }
                if (data[orderNumber]) {
                    resultData.state = true;
                    resultData.data = data[orderNumber]
                }
                callback(resultData);
            });
        } else if (message.hasOwnProperty("type")&& message.type==="set-ec-pdf-data") {
            let ecName = message.ecName;
            let key = `${EC_KEY_PREFIX}${ecName}`;
            let list = [key];
            let orderNumber = message.orderNumber
            let pdfStr = message.pdfStr;
            chrome.storage.local.get(list, (result) => {
                let data = result[key];
                // もしデータがなければ配列にする
                if (!data) {
                    data = {};
                }
                data[orderNumber] = {pdfStr}
                chrome.storage.local.set({[key]: data}, result => {
                    callback();
                })
            });
        }

        return true;
    }
)