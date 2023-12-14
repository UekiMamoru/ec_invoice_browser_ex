const EC_KEY_PREFIX = "ec_"
// バージョンが古い場合でフラッシュ
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "update") {
        // とりあえずバージョンアップ時は削除
        // flush();
        // 以前のバージョンを取得
        const previousVersion = details.previousVersion;

        // 現在のバージョンを取得
        const currentVersion = chrome.runtime.getManifest().version;

        // バージョンが0.0.1から0.0.2にアップデートされたかを確認
        if (previousVersion === "0.0.2" && currentVersion === "0.0.3") {

        }
    }

    function flush() {
        // 特定のアップデート処理を実行
        chrome.storage.local.clear(function () {
            var error = chrome.runtime.lastError;
            if (error) {
                console.error(error);
            } else {
                console.log("All data cleared from local storage.");
            }
        });
    }
});

// オフスクリーンを開く

let creating ;
async function setupOffscreenDocument(path) {
    // Check all windows controlled by the service worker to see if one
    // of them is the offscreen document with the given path
    const offscreenUrl = chrome.runtime.getURL(path);
    const existingContexts = await chrome.runtime.getContexts({
        contextTypes: ['OFFSCREEN_DOCUMENT'],
        documentUrls: [offscreenUrl]
    });

    if (existingContexts.length > 0) {
        return;
    }

    // create offscreen document
    if (creating) {
        await creating;
    } else {
        creating = chrome.offscreen.createDocument({
            url: path,
            // reasons: ['CLIPBOARD'],
            reasons: ['BLOBS', "DOM_SCRAPING", "DOM_PARSER","WORKERS","LOCAL_STORAGE"],
            justification: 'reason for needing the document',
        });
        await creating;
        creating = null;
    }
}


setupOffscreenDocument( 'offscreen/offscreen.html');
chrome.runtime.onMessage.addListener(
    (message, sender, callback) => {
        if (message.hasOwnProperty("type") && message.type === "get-ec-pdf-data") {
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
        } else if (message.hasOwnProperty("type") && message.type === "set-ec-pdf-data") {
            let ecName = message.ecName;
            let key = `${EC_KEY_PREFIX}${ecName}`;
            let list = [key];
            let orderNumber = message.orderNumber
            let pdfStr = message.pdfStr;
            let fileName = message.fileName;
            let isInvoice = message.isInvoice;
            let param = message.param
            let pdfStrs = message.pdfStrs
            chrome.storage.local.get(list, (result) => {
                let data = result[key];
                // もしデータがなければ配列にする
                if (!data) {
                    data = {};
                }
                data[orderNumber] = {pdfStr, fileName, isInvoice, pdfStrs, param}
                chrome.storage.local.set({[key]: data}, result => {
                    callback();
                })
            });
        } else if (message.hasOwnProperty("type") && message.type === "invoice-result") {
            chrome.tabs.create({url: chrome.runtime.getURL("option/invoice-result.html")}).then(
                (tab) => {
                    let id = tab.id;
                    sleep(500).then(
                        () => {
                            console.log(message);
                            chrome.tabs.sendMessage(id, message);
                        }
                    )
                }
            )
        }

        return true;
    }
);

async function sleep(milSec = 1000) {
    return new Promise(resolve => {

        setTimeout(() => {
            resolve()
        }, milSec)
    })
}
