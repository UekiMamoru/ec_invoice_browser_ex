import {Thread} from "../../util/Thread";
import {
    AmazonOrderDataObj,
    AmazonInvoiceObj,
    AmazonInvoiceDataParamObj,
    AmazonResultTransferObject
} from "../../../types";
import {PDFDownloader} from "../../../../model/PDFDownloader";
import {PDFBufferData} from "../../../../model/PDFBufferData";

const AMAZON_EC_NAME = "amazon";

export const CreateInvoice = (prop: {
    callback: Function,
    getState: Function
}) => {
    let {callback, getState} = prop;

    return (


        <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            callback(true);
            createInvoiceData();
            createList(false).finally(() => {
                callback(false)
            })
        }} disabled={getState()}>
            ページに表示された注文情報のインボイスデータを作る
        </button>

    )
}

function createInvoiceData() {
}

function exportUserLogMsg(msg: string) {

}

async function createList(includeDigital: boolean = false) {

    let isPdfGetAndDownload = true;// document.getElementById(PDF_GET_AND_DOWNLOAD_CHOICE_ID).checked;
    let pdfGetAndDownloadMsg = `PDF取得とダウンロードを同時に行います`
    if (!isPdfGetAndDownload) {
        pdfGetAndDownloadMsg = `PDF取得のみ行います`
    }
    exportUserLogMsg(pdfGetAndDownloadMsg)
    // デジタル以外を取得
    let list = includeDigital ? createOrders() : filterNonDigitalOrders();
    exportUserLogMsg(`対象は${list.length}件です`)
    let resultOrderOutputs = [];
    for (const amazonOrderDataObj of list) {
        if (amazonOrderDataObj) {
            exportUserLogMsg(`注文番号${amazonOrderDataObj.no}の処理を開始します`)
            let fileName = `amazon_${amazonOrderDataObj.date}_${amazonOrderDataObj.no}`
            let isInvoice = false;
            // todo 当該注文番号に紐づくシリアライズしたデータがあるかチェック
            let getVal = {
                ecName: AMAZON_EC_NAME,
                orderNumber: amazonOrderDataObj.no,
                type: "get-ec-pdf-data",

            }
            let amazonInvoiceObj: AmazonInvoiceObj = {
                isQualifiedInvoice: true,
                isCreateInvoicePDF: true,
                qualifiedInvoiceReason: "",
                sellerContactURLs: [],
                invoiceList: [],
            }
            let result = await chrome.runtime.sendMessage(getVal);
            // 既にあったので、既存データで作成
            let pdfArrayBuffer;
            if (result.state) {
                exportUserLogMsg(`キャッシュに存在していたため、キャッシュデータを利用します。`)
                let data = result.data
                amazonInvoiceObj = result.data.param//.invoiceList;
                //
                data.pdfStrs.forEach((pdfStr: string, idx: number) => {
                    let fileName = `tmp_${result.data.fileName}${idx > 1 ? idx - 1 : ""}`;
                    pdfArrayBuffer = (arrayBuffSerializableStringToArrayBuff(pdfStr));
                    if (pdfArrayBuffer) {
                        if (isPdfGetAndDownload) downloadPDF(pdfArrayBuffer, fileName);
                    } else {
                        // 何らかのエラーでpdfArrayBufferが作れなかったので、エラーとして注文番号を注文番号を保持
                    }
                    pdfArrayBuffer = "";
                    // param = invoiceListParam;
                });
            } else {
                let invoiceURL = amazonOrderDataObj.invoiceData.url;
                let url = `https://www.amazon.co.jp${invoiceURL}`;
                // urlをフェッチリクエストしてPDFリンクを生成
                exportUserLogMsg(`PDFが存在するか確認します...`)
                let res = await fetch(url);
                let text = await res.text();
                let parser = new DOMParser();
                let invoiceLinkNode = parser.parseFromString(text, "text/html");
                let target: HTMLAnchorElement[] = Array.from(invoiceLinkNode.querySelectorAll(`.invoice-list a[href$="invoice.pdf"]`));
                // invoice.pdfで判定するが、複数あるケースやインボイスでない場合がある
                /**
                 * <ul class="a-unordered-list a-vertical invoice-list a-nowrap">
                 *     <li><span class="a-list-item">
                 *         <a class="a-link-normal" href="/documents/download/b62c4b4e-5338-4ab9-8358-ce73b3978302/invoice.pdf">
                 *             支払い明細書 1
                 *         </a>
                 *     </span></li>
                 *     <li><span class="a-list-item">
                 *         <a class="a-link-normal" href="/gp/help/contact/contact.html/ref=oh_aui_ajax_request_invoice?ie=UTF8&amp;orderID=250-4129616-1192621&amp;sellerID=A1NLN7B5GTL0T6&amp;subject=30">
                 *             請求書をリクエスト
                 *         </a>
                 *     </span></li>
                 *     <li><span class="a-list-item">
                 *         <a class="a-link-normal" href="/gp/css/summary/print.html/ref=oh_aui_ajax_invoice?ie=UTF8&amp;orderID=250-4129616-1192621">
                 *             領収書／購入明細書
                 *         </a>
                 *     </span></li>
                 * </ul>
                 */
                // 請求書をリクエストのテキストがある場合は適格者の物ではない、この場合はオーダーIDで引っ張る
                //
                //
                // 複数あるケース
                /*
                <ul class="a-unordered-list a-vertical invoice-list a-nowrap">
    <li><span class="a-list-item">
        <a class="a-link-normal" href="/documents/download/904878fd-1644-474c-a804-99a766097133/invoice.pdf">
            支払い明細書 1
        </a>
    </span></li>
    <li><span class="a-list-item">
        <a class="a-link-normal" href="/documents/download/f4f29d4e-7604-4650-aa67-07b348c15db4/invoice.pdf">
            支払い明細書 2
        </a>
    </span></li>
    <li><span class="a-list-item">
        <a class="a-link-normal" href="/documents/download/26e3893b-8acc-4dce-ba8c-56e8eaf7ba45/invoice.pdf">
            支払い明細書 3
        </a>
    </span></li>
    <li><span class="a-list-item">
        <a class="a-link-normal" href="/gp/css/summary/print.html/ref=oh_aui_ajax_invoice?ie=UTF8&amp;orderID=250-0400874-3412639">
            領収書／購入明細書
        </a>
    </span></li>
</ul>
                 */


                if (target.length) {
                    exportUserLogMsg(`${amazonOrderDataObj.no}のオーダーは${target.length}件データが見つかりました`)
                    // もし、「請求書をリクエスト」が存在したら、適格領収書ではない可能性あり
                    let urlLinkNodes = []
                    if (invoiceLinkNode.body.innerHTML.indexOf("help/contact/contact.html") !== -1) {
                        // 発見したので適格領収書ではない可能性があるがこの時点では特定できない
                        // fileName = `_${fileName}`
                        urlLinkNodes = Array.from(invoiceLinkNode.body.querySelectorAll(`a[href*="help/contact/contact.html"]`));
                        urlLinkNodes.forEach(elem => {
                            if (elem instanceof HTMLAnchorElement) {
                                let href = elem.href
                                if (href) {
                                    amazonInvoiceObj.sellerContactURLs.push(href)
                                }
                            }
                        });
                        //.href;
                        // isInvoice = false;
                        // exportUserLogMsg(`PDFは適格領収書ではないかもしれません`)
                    }
                    let pdfStrs = []
                    for (let i = 0; i < target.length; i++) {
                        let pdfURL = target[i].href
                        let idx = i + 1;
                        let copyParam = createAmazonInvoiceDataParamObj();
                        amazonInvoiceObj.invoiceList.push(copyParam);
                        copyParam.fileIdx = idx;
                        try {
                            // PDF　URLが複数ある可能性があるので、リスト化する

                            exportUserLogMsg(`PDF情報${idx}番目の取得を開始します`)
                            pdfArrayBuffer = await getPDFArrayBuffer(pdfURL);
                            exportUserLogMsg(`PDF情報を取得しました`)
                            // // stringへ変換
                            let pdfStr = arrayBufferToStringSerializable(pdfArrayBuffer);
                            pdfStrs.push(pdfStr);

                            // 取得したPDFデータを解析
                            let decodeCheck = {
                                type: `pdf-decode`
                                , pdfStr
                            }
                            exportUserLogMsg(`PDF情報を解析します`)
                            /**
                             * @type {{ type: string,invoiceId: string,isInvoice: boolean }}
                             */
                            let pdfResult = await chrome.runtime.sendMessage(
                                decodeCheck
                            )

                            copyParam.isQualifiedInvoice = pdfResult.isInvoice;//isInvoice;
                            amazonInvoiceObj.isCreateInvoicePDF &&= pdfResult.isInvoice;
                            amazonInvoiceObj.isCreateInvoicePDF = Boolean(amazonInvoiceObj.isCreateInvoicePDF)
                            copyParam.invoiceId = pdfResult.invoiceId
                            exportUserLogMsg(`PDF情報を解析が終了しました`)
                            if (pdfArrayBuffer) {
                                if (isPdfGetAndDownload) {
                                    let number = idx > 1 ? `-${idx - 1}` : ""
                                    let exportFileName = `${fileName}${number}`
                                    downloadPDF(pdfArrayBuffer, exportFileName);
                                }
                            } else {
                                // 何らかのエラーでpdfArrayBufferが作れなかったので、エラーとして注文番号を注文番号を保持

                            }
                            console.log(pdfResult);
                        } catch (e) {
                            // PDF自体はあったが、制作過程で何らかのエラーが生じ作れなかった
                            exportUserLogMsg(`PDF情報取得時にエラーが発生し取得できませんでした。`)
                            copyParam.qualifiedInvoiceReason = "取得エラー";
                        }
                    }
                    exportUserLogMsg(`PDF情報をキャッシュします`)
                    let id = amazonOrderDataObj.no

                    // PDF自体は作れてる
                    amazonInvoiceObj.isCreateInvoicePDF = true;
                    amazonInvoiceObj.qualifiedInvoiceReason = "作成";
                    let sendVal = {
                        ecName: AMAZON_EC_NAME,
                        orderNumber: amazonOrderDataObj.no,
                        type: "set-ec-pdf-data",
                        pdfStrs,
                        fileName,
                        isInvoice,
                        amazonInvoiceObj,
                        amazonOrderDataObj
                    };
                    chrome.runtime.sendMessage(sendVal, () => {
                        exportUserLogMsg(`[${id}]のPDF情報のキャッシュが完了しました`)
                    })

                } else {
                    // param.isCachePDF = false
                    amazonInvoiceObj.isCreateInvoicePDF = false
                    amazonInvoiceObj.isQualifiedInvoice = false

                    // todo .pdfで終わるものが無かったので、ここはエラーを保持して警告出す
                    // A.発送や会計処理終わってないケース
                    // <a class="a-link-normal" hrclassNamegp/help/customer/display.html/ref=oh_aui_ajax_legal_invoice_help?ie=UTF8&amp;nodeId=201986650">
                    //             領収書／購入明細書がご利用になれません。くわしくはこちら。
                    //         </a>
                    invoiceLinkNode.querySelectorAll(`a`)
                    let target = Array.from(invoiceLinkNode.querySelectorAll("a"))
                        .find(a => {
                            if (a.textContent) {
                                return a.textContent.indexOf("領収書／購入明細書がご利用になれません。") !== -1
                            }
                            return false;
                        })
                    if (target) {
                        amazonInvoiceObj.qualifiedInvoiceReason = `未発送・会計処理未済の注文もしくは、電子マネーの注文`
                    } else {
                        amazonInvoiceObj.qualifiedInvoiceReason = `領収書の発行しか出来ず、適格請求書・支払い明細が取得できない注文`
                    }
                    exportUserLogMsg(`${amazonInvoiceObj.qualifiedInvoiceReason}`)
                }
            }

            resultOrderOutputs.push(createOrderOutputObject(amazonOrderDataObj, amazonInvoiceObj))

        }

        await Thread.sleep(500);
        exportUserLogMsg(`${amazonOrderDataObj.no}の処理が終了しました`)
    }

    // console.log(resultOrderOutputs);

    exportUserLogMsg(`デジタル${includeDigital ? "を含んだ" : "を含まない"}商品のデータ${list.length}件の処理が終了しました`)
    exportUserLogMsg(`結果ページを開きます。`)
    chrome.runtime.sendMessage(
        {type: "invoice-result", site: "Amazon", data: resultOrderOutputs}
    )
}


function createOrders(): AmazonOrderDataObj[] {
    let orderNodes = Array.from(document.querySelectorAll(`.js-order-card`))
        .filter(e => {
            let parentElement = e.parentElement;
            return (parentElement && parentElement.classList.contains(`js-order-card`))
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
    let orderObj: AmazonOrderDataObj
        = {
        no: ""
        , productList: []
        , date: ""
        , price: {
            total: ""
        }
        , invoiceData: {url: ""}
        , isDigital: false
    }
    orderObj.no = node.querySelector(`.yohtmlc-order-id .value,.yohtmlc-order-id [dir="ltr"]`)!.textContent!.trim()
    // todo 複数ある場合があるので先頭のみ、ただデータとしては取得する可能性あり
    // todo 商品リンクとASINは保持
    let linkNodes = Array.from(node.querySelectorAll("a"))
        .filter(node => node.href)
        .filter(node => node.href.match(/\/[A-Z,0-9]{10}[/|?]/))
    let titles = linkNodes
        .filter(a => !a.querySelector("img"));
    let images = linkNodes
        .filter(a => a.querySelector("img"));
    titles.forEach((titleLinkNode, index) => {
        //
        let href = titleLinkNode.href;
        if (!href) href = "";
        let matched = href.match(/\/[A-Z,0-9]{10}[/|?]/);
        let asin = "";
        if (matched) {
            asin = matched[0]
                .replaceAll("/", "")
                .replaceAll("?", "");
        }
        let title = titleLinkNode.textContent ? titleLinkNode.textContent : "";
        let imageWrapLinkNode = images[index];
        let img = imageWrapLinkNode.querySelector("img");

        let imgSrc = "";
        if (img) {
            let src = img.getAttribute("src")
            if (src) {
                imgSrc = src;
            }
            src = img.getAttribute("data-src")
            if (src) {
                imgSrc = src;
            }
        }
        orderObj.productList.push(
            {asin, href, title, imgSrc}
        )

    })
    //
    let priceTotalNode = node.querySelector(`.yohtmlc-order-total .value,.yohtmlc-order-total`);
    if (priceTotalNode) {
        orderObj.price.total = priceTotalNode.textContent!.trim()
    }
    let dataNode = Array.from(node.querySelectorAll(`.order-header span,.order-info span`))
        .find(e => e.textContent!.trim().match(/[0-9]{4}年[0-9]{1,2}月[0-9]{1,2}日/));
    if (dataNode) {
        orderObj.date = dataNode.textContent!.trim()
    }
    // ヘッダーの日付フォーマットを取得
    // キャンセルの場合、領収書等がでないのでその時点でnull返却
    try {
        orderObj.invoiceData = getInvoiceURLFormatObject(node);
    } catch (e) {
        // エラーとなった注文番号は知りたいので、ログに出す
        exportUserLogMsg(`${orderObj.no}は領収書が有りません`)
        return null
    }
    orderObj.isDigital = Boolean(orderObj.no.match(/^D/))
    return orderObj;
}

function getInvoiceURLFormatObject(node: HTMLElement): any {
    let nodeList: HTMLElement[] = Array.from(node.querySelectorAll(`.order-info .yohtmlc-order-level-connections [data-a-popover],.order-header .yohtmlc-order-level-connections [data-a-popover]`));
    if (nodeList) {
        let invoiceTarget = nodeList.filter(elem => ~(elem.textContent!.indexOf("領収書")))[0];
        if (invoiceTarget) {
            let jsonData = invoiceTarget.getAttribute("data-a-popover");
            if (jsonData) return JSON.parse(jsonData)
        }
    }
    throw new Error("invoice data not found");


}


async function getPDFArrayBuffer(
    url = 'https://www.amazon.co.jp/documents/download/812ccde1-8a52-4f91-a4e3-8d0a9638bc56/invoice.pdf',
    options = {}
) {
    let res = await fetch(url);
    let arrayBuff = await res.arrayBuffer();
    return arrayBuff;
}


function arrayBufferToStringSerializable(arrayBuff: ArrayBufferLike) {
    return  PDFBufferData.arrayBufferToStringSerializable(arrayBuff);
}

function arrayBuffSerializableStringToArrayBuff(str: string): ArrayBufferLike {
    return  PDFBufferData.arrayBuffSerializableStringToArrayBuff(str);
}

function downloadPDF(arrayBuffer: ArrayBufferLike, fileName: string) {
    PDFDownloader.downloadPDF(arrayBuffer,fileName);
}


/**
 *
 * @param orderObj
 * @param param
 */
function createOrderOutputObject(orderObj: AmazonOrderDataObj, param: AmazonInvoiceObj):AmazonResultTransferObject {
    let output = {
        orderNumber: orderObj.no,
        date: orderObj.date,
        price: orderObj.price.total,
        isDigital: orderObj.isDigital,
        productDataList: orderObj.productList,
        isMultipleOrder: orderObj.productList.length > 1,
        isQualifiedInvoice: param.isQualifiedInvoice,
        isCreateInvoicePDF: param.isCreateInvoicePDF,
        qualifiedInvoiceReason: param.qualifiedInvoiceReason,
        sellerContactURLs: param.sellerContactURLs,
        invoiceList: param.invoiceList
    }
    return output;
}

function createAmazonInvoiceDataParamObj(): AmazonInvoiceDataParamObj {
    return {
        isQualifiedInvoice: false,
        isCreateInvoicePDF: false,
        qualifiedInvoiceReason: "",
        sellerContactURL: "",
        sellerURL: "",
        isCachePDF: false,
        invoiceId: "",
        fileIdx: 0
    }
}
