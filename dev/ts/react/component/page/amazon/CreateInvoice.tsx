import {
    AmazonOrderDataObj,
} from "../../../types";
import {useState} from "react";
import {LoaderField} from "../../../../model/LoaderField";
import {ViewLogger} from "../../../../view/ViewLogger";
import {DownloadFileNameCreator} from "../../../../model/util/DownloadFileNameCreator";
import JSZip from "jszip";
import {HistoryDownload} from "../../../../model/amazon/HistoryDownload";
import {AmazonHistoryElementDataConverter} from "../../../../model/amazon/converter/AmazonHistoryElementDataConverter";

const AMAZON_EC_NAME = "amazon";
const loaderField = new LoaderField();
const viewLogger = new ViewLogger();
viewLogger.field = loaderField.msgBox;
const downloadFileNameCreator = new DownloadFileNameCreator("amazon");
export const CreateInvoice = (prop: {
    callback: Function,
    getState: Function
}) => {
    let {callback, getState} = prop;
    let [isDigital, setIsDigital] = useState(false);
    let [isZip, setIsZip] = useState(true);

    return (

        <>
            <div style={{display: "flex", gap: ".5em"}}>
                <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    callback(true);
                    createList(isDigital, isZip, callback)
                }} disabled={getState()}>
                    表示された注文情報のインボイスデータを作成
                </button>
                <div>
                    <label><input type="checkbox" disabled={getState()} checked={isDigital} onChange={() => {
                        setIsDigital(!isDigital);
                    }}/>デジタル含める</label>
                    <label><input type="checkbox" disabled={getState()} checked={isZip} onChange={() => {
                        setIsZip(!isZip);
                    }}/>年月ごとにまとめてZIPダウンロードをする</label>

                </div>
            </div>
        </>

    )
}

function exportUserLogMsg(msg: string) {
    viewLogger.log(msg);
}

function fieldOpen() {
    loaderField.flashMsg();
    loaderField.show();
}

function fieldClose() {
    loaderField.hide();
}


async function createList(includeDigital: boolean = false, isZip: boolean = false, callback: Function) {
    fieldOpen();
    let isPdfGetAndDownload = true;// document.getElementById(PDF_GET_AND_DOWNLOAD_CHOICE_ID).checked;
    let pdfGetAndDownloadMsg = `PDF取得とダウンロードを同時に行います`
    if (!isPdfGetAndDownload) {
        pdfGetAndDownloadMsg = `PDF取得のみ行います`
    }
    if(isZip){
        pdfGetAndDownloadMsg+="(年月でZIP圧縮します)"
    }
    exportUserLogMsg(pdfGetAndDownloadMsg)
    // デジタル以外を取得
    let list = includeDigital ? createOrders() : filterNonDigitalOrders();
    exportUserLogMsg(`対象は${list.length}件です`);
    let historyDataDownload = new HistoryDownload();
    historyDataDownload.logger = viewLogger;
    historyDataDownload.isZip = isZip;
    let resultOrderOutputs = await historyDataDownload.exec(list)
    exportUserLogMsg(`デジタル${includeDigital ? "を含んだ" : "を含まない"}商品のデータ${list.length}件の処理が終了しました`)
    exportUserLogMsg(`結果ページを開きます。`)
    chrome.runtime.sendMessage(
        {type: "invoice-result", site: "Amazon", data: resultOrderOutputs}
    )
    if (callback) {
        callback(false);
    }
    fieldClose()
}


function createOrders(): AmazonOrderDataObj[] {
    let orderNodes = Array.from(document.querySelectorAll(`.js-order-card`))
        .filter(e => {
            // 子どもに同じようにあったら含めない
            return e.querySelectorAll(`.js-order-card`).length < 1
        });
    let list: AmazonOrderDataObj[] = []
    orderNodes.forEach(
        node => {
            if (node instanceof HTMLElement) {
                let obj = createOrderObject(node);
                if (obj) list.push(obj)
            }
        }
    )
    console.log(list);
    return list
}

function filterNonDigitalOrders() {
    return createOrders().filter(d => !d.isDigital)
}

function createOrderObject(node: HTMLElement): AmazonOrderDataObj | null {
    let v = new AmazonHistoryElementDataConverter();
    v.logger = viewLogger;
    return v.elementToAmazonOrderDataObj(node)
}