import {Thread} from "../content/util/Thread";
import {FileNameFormatObj} from "../../ts/react/types";
import {FileFormatStorage} from "../../ts/db/FileFormatStorage";

const EC_KEY_PREFIX = "ec_";
let lastData;
let fileFormatStorage = new FileFormatStorage()

// バージョンが古い場合でフラッシュ
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === "update") {
        // 以前のバージョンを取得
        const previousVersion = details.previousVersion;

        // 現在のバージョンを取得
        const currentVersion = chrome.runtime.getManifest().version;

        if (previousVersion < currentVersion) {
            // とりあえずバージョンアップ時は削除
            // flush();
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

let creating;

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
            reasons: ['BLOBS', "DOM_SCRAPING", "DOM_PARSER", "WORKERS", "LOCAL_STORAGE"],
            justification: 'reason for needing the document',
        });
        await creating;
        creating = null;
    }
}


setupOffscreenDocument('offscreen/offscreen.html');
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
            let fileName = message.fileName;
            let isInvoice = message.isInvoice;
            let amazonInvoiceObj = message.amazonInvoiceObj
            let pdfStrs = message.pdfStrs
            let amazonOrderDataObj = message.amazonOrderDataObj
            chrome.storage.local.get(list, (result) => {
                let data = result[key];
                // もしデータがなければ配列にする
                if (!data) {
                    data = {};
                }
                data[orderNumber] = {fileName, isInvoice, pdfStrs, amazonInvoiceObj, amazonOrderDataObj}
                chrome.storage.local.set({[key]: data}, result => {
                    callback();
                })
            });
        } else if (message.hasOwnProperty("type") && message.type === "invoice-result") {
            lastData = message;
            chrome.tabs.create({url: chrome.runtime.getURL("option/invoice-result.html")}).then(
                (tab) => {
                    let id = tab.id;
                    Thread.sleep(500).then(
                        () => {
                            console.log(lastData);
                            chrome.tabs.sendMessage(id, lastData);
                        }
                    )
                }
            )
        } else if (message.hasOwnProperty("type") && message.type === "pdf-decode") {
            let offscreenMessage = {type: `offscreen-pdf-decode`, pdfStr: message.pdfStr};
            chrome.runtime.sendMessage(offscreenMessage, (result) => {
                callback(result);
            })
        } else if (message.hasOwnProperty("type") && message.type === "get-last-data") {
            callback(lastData);
        } else if (message.hasOwnProperty("type") && message.type === "get-file-format") {
            // fileFormat
            fileFormatStorage.get().then(format => {
                callback(format)
            })
        } else if (message.hasOwnProperty("type") && message.type === "set-file-format") {
            // fileFormat
            fileFormatStorage.update(message.data).then(() => {
                callback()
            })
        }

        return true;
    }
);


async function getActiveName() {
    // 現在アクティブであろう
}
async function addEcUser(ecName,userData={}){

}
async function getEcUsers(ecName) {
    // ec登録名に紐づく名前を取得する
    let key = `ecUsers`;
    let list = [key]
    let result = await chrome.storage.local.get(list);
    let data = result[key];
    // もしデータがなければ配列にする
    if (!data) {
        data = {};
    }
    // 無ければ空文字


}

