/*
<span className="a-declarative" data-action="a-popover"
      data-a-popover="{&quot;url&quot;:&quot;/gp/shared-cs/ajax/invoice/invoice.html?orderId=503-3116098-9223044&amp;relatedRequestId=0VHQAVNXESE1GPZQFT6Q&amp;isADriveSubscription=&amp;isBookingOrder=0&quot;,&quot;position&quot;:&quot;triggerBottom&quot;,&quot;ajaxFailMsg&quot;:&quot;\n\u003cdiv class=\&quot;a-box a-alert-inline a-alert-inline-warning\&quot;>\u003cdiv class=\&quot;a-box-inner a-alert-container\&quot;>\u003ci class=\&quot;a-icon a-icon-alert\&quot;>\u003c/i>\u003cdiv class=\&quot;a-alert-content\&quot;>\n        \u003cspan class=\&quot;a-text-bold\&quot;>\n            請求書の取得中に問題がありました。\n        \u003c/span>\n\u003c/div>\u003c/div>\u003c/div>\n\u003cdiv class=\&quot;a-row a-spacing-top-mini\&quot;>\n    ご注文については、注文の詳細をご覧ください。\n\u003c/div>\n\u003cdiv class=\&quot;a-row\&quot;>\n    \u003ca class=\&quot;a-link-emphasis\&quot; href=\&quot;/gp/your-account/order-details/ref=oh_aui_invorder_details?ie=UTF8&amp;orderID=503-3116098-9223044\&quot;>注文内容を表示\u003c/a>\n\u003c/div>\n&quot;,&quot;activate&quot;:&quot;onclick&quot;}">
    <a href="javascript:void(0)" className="a-popover-trigger a-declarative">
        領収書等
    <i className="a-icon a-icon-popover"></i></a>
</span>
 */
import {ProductDataInserter} from "../view/ProductDataInserter";
import {TermProductDataInsertVM} from "../vm/TermProductDataInsertVM";
import {ViewLogger} from "../view/ViewLogger";
import {Thread} from "../util/Thread";
import {AmazonHistoryCtrlLock} from "../view/ctrl/AmazonHistoryCtrlLock";

const AMAZON_EC_NAME = "amazon"
amazonOrderPage()

function amazonOrderPage() {

    if (!isOrderPage()) {
        return;
    }

    let viewLogger = new ViewLogger();
    const amazonHistoryCtrlLock = new AmazonHistoryCtrlLock();
    amazonHistoryCtrlLock.logger = viewLogger;
    const EXEC_ELEMENT_ID = `ecInvoiceExec`;
    const EXEC_YEAR_PRODUCT_LIST_ID = `ecYearProductListExec`;
    const INCLUDE_DIGITAL_CHOICE_ID = `ecDigitalChoice`;
    const LOG_MESSAGE_FIELD = `ecLogMsgField`;
    const PDF_GET_AND_DOWNLOAD_CHOICE_ID = `ecPdfGetAndDownload`;
    amazonHistoryCtrlLock.lockTargetSelectors = [
        `#${EXEC_ELEMENT_ID}`,
        `#${EXEC_YEAR_PRODUCT_LIST_ID}`,
        `#${INCLUDE_DIGITAL_CHOICE_ID}`,
        `#${PDF_GET_AND_DOWNLOAD_CHOICE_ID}`,
    ]
    let includeDigital = false;
    // オーダーページなので、デジタル以外
    // 動作用フィールドを挿入する
    // todo 動的にページが更新されるので、以降はbodyの更新タイミングで挿入ノードが生きているか監視
    let insertNode = createControlFieldElem();
    let t = getInsertTarget()
    t.prepend(insertNode);
    viewLogger.field = document.getElementById(LOG_MESSAGE_FIELD);
    addEvent();

    function addEvent() {
        let ev = clickEvFunc;
        let changeEv = changeEvFunc
        document.body.addEventListener("click", ev);
        document.body.addEventListener("change", changeEv);
    }

    async function clickEvFunc(event) {
        // ロック中なら何もしない
        let target
            = event.target.closest(`#${EXEC_ELEMENT_ID}`);
        if (target) {
            if (amazonHistoryCtrlLock.isLock) return;
            amazonHistoryCtrlLock.lock();

            // イベント進行中は捨てる
            return createList(event).then(() => {

            }).finally(() => {
                amazonHistoryCtrlLock.unlock();
            })
        }
    }

    async function changeEvFunc(event) {
        if (amazonHistoryCtrlLock.isLock) return;
        let asyncFunc = null;
        if (event.target.closest(`#${EXEC_YEAR_PRODUCT_LIST_ID}`)) {
            asyncFunc = createYearList(event)
        } else if (event.target.closest(`#${INCLUDE_DIGITAL_CHOICE_ID}`)) {
            asyncFunc = changeDigitalChoice(event)
        }


        if (asyncFunc) {
            amazonHistoryCtrlLock.lock();
            asyncFunc.finally(() => {
                amazonHistoryCtrlLock.unlock();
            })
        }
    }

    async function changeDigitalChoice(event) {
        let target = event.target.closest(`#${INCLUDE_DIGITAL_CHOICE_ID}`)
        includeDigital = target.checked;
    }

    async function createYearList(event) {
        let target = event.target.closest(`#${EXEC_YEAR_PRODUCT_LIST_ID}`);
        let year = target.value;
        if (!year) return;
        // 選択期間の取得
        year = year.trim().replaceAll(/[^0-9]/ig, "")
        try {

            document.querySelector(".a-pagination").style.display = "none";
        } catch (e) {

        }
        // ページネーション
        let vm = new TermProductDataInsertVM();
        vm.year = year;
        vm.inserter = new ProductDataInserter();
        vm.logger = viewLogger;
        return await vm.exec();
    }

    async function firstDataInsert() {

    }

    /**
     *
     * @param orderObj
     * @param param
     * @returns {{date: string, orderNumber: string, isDigital: boolean, sellerURLs: *, isCreateInvoicePDF: (boolean|*), productDataList: string, sellerContactURLs: [], isMultipleOrder: boolean, invoiceList: ([]|*), sellerURL: (string|string|*), price: string, isQualifiedInvoice: (boolean|*), invoiceId: (string|string|*), isCachePDF: (boolean|*), qualifiedInvoiceReason}}
     */
    function createOrderOutputObject(orderObj, param) {
        let output = {
            orderNumber: orderObj.no,
            date: orderObj.date,
            price: orderObj.price.total,
            isDigital: orderObj.isDigital,
            productDataList: orderObj.title,
            isMultipleOrder: orderObj.title.length > 1,
            isQualifiedInvoice: param.isQualifiedInvoice,
            isCreateInvoicePDF: param.isCreateInvoicePDF,
            qualifiedInvoiceReason: param.qualifiedInvoiceReason,
            sellerContactURLs: param.sellerContactURLs,
            invoiceId: param.invoiceId,
            sellerURL: param.sellerURL,
            sellerURLs: param.sellerURLs,
            isCachePDF: param.isCachePDF,
            invoiceList: param.invoiceList

        }
        return output;
    }

    async function createList(event) {
        if (!event.target.closest(`#${EXEC_ELEMENT_ID}`)) return

        let isPdfGetAndDownload = true;// document.getElementById(PDF_GET_AND_DOWNLOAD_CHOICE_ID).checked;
        let pdfGetAndDownloadMsg = `PDF取得とダウンロードを同時に行います`
        if (!isPdfGetAndDownload) {
            pdfGetAndDownloadMsg = `PDF取得のみ行います`
        }
        exportUserLogMsg(pdfGetAndDownloadMsg)
        exportUserLogMsg(`デジタル${includeDigital ? "を含んだ" : "を含まない"}商品のデータを取得します...`)
        // デジタル以外を取得
        let list = includeDigital ? createOrders() : filterNonDigitalOrders();
        exportUserLogMsg(`対象は${list.length}件です`)
        let resultOrderOutputs = [];
        for (const data of list) {
            if (data) {
                exportUserLogMsg(`注文番号${data.no}の処理を開始します`)
                let fileName = `amazon_${data.date}_${data.no}`
                let isInvoice = false;
                // todo 当該注文番号に紐づくシリアライズしたデータがあるかチェック
                let getVal = {
                    ecName: AMAZON_EC_NAME,
                    orderNumber: data.no,
                    type: "get-ec-pdf-data",

                }
                let param = {
                    isQualifiedInvoice: true,
                    isCreateInvoicePDF: true,
                    qualifiedInvoiceReason: "",

                    sellerContactURLs: [],
                    invoiceList: [],
                }
                /**
                 *
                 * @type {{sellerURL: string, isCreateInvoicePDF: boolean, isQualifiedInvoice: boolean, fileIdx: number, isCachePDF: boolean, invoiceId: string, sellerContactURL: string, qualifiedInvoiceReason: string}}
                 */
                let invoiceListParam = {
                    isQualifiedInvoice: true,
                    isCreateInvoicePDF: true,
                    qualifiedInvoiceReason: "",
                    sellerContactURL: "",
                    sellerURL: "",
                    isCachePDF: false,
                    invoiceId: "",
                    fileIdx: 0
                }
                let result = await chrome.runtime.sendMessage(getVal);
                // 既にあったので、既存データで作成
                let pdfArrayBuffer;
                if (result.state) {
                    exportUserLogMsg(`キャッシュに存在していたため、キャッシュデータを利用します。`)
                    let data = result.data
                    param = result.data.param//.invoiceList;
                    //
                    data.pdfStrs.forEach((pdfStr, idx) => {
                        let fileName = `tmp_${result.data.fileName}${idx > 1 ? idx - 1 : ""}`;
                        pdfArrayBuffer=(arrayBuffSerializableStringToArrayBuff(pdfStr));
                        if (pdfArrayBuffer) {
                            if (isPdfGetAndDownload) downloadPDF(pdfArrayBuffer, fileName);
                        } else {
                            // 何らかのエラーでpdfArrayBufferが作れなかったので、エラーとして注文番号を注文番号を保持
                        }
                        pdfArrayBuffer = "";
                        // param = invoiceListParam;
                    });
                } else {
                    let url = `https://www.amazon.co.jp${data.invoiceData.url}`;
                    // urlをフェッチリクエストしてPDFリンクを生成
                    exportUserLogMsg(`PDFが存在するか確認します...`)
                    let res = await fetch(url);
                    let text = await res.text();
                    let parser = new DOMParser();
                    let invoiceLinkNode = parser.parseFromString(text, "text/html");
                    let target = Array.from(invoiceLinkNode.querySelectorAll(`.invoice-list a[href$="invoice.pdf"]`));
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
                        exportUserLogMsg(`${data.no}のオーダーは${target.length}件データが見つかりました`)
                        // もし、「請求書をリクエスト」が存在したら、適格領収書ではない可能性あり
                        let urlLinkNodes = []
                        if (invoiceLinkNode.body.innerHTML.indexOf("help/contact/contact.html") !== -1) {
                            // 発見したので適格領収書ではない可能性があるがこの時点では特定できない
                            // fileName = `_${fileName}`
                            urlLinkNodes = Array.from(invoiceLinkNode.body.querySelectorAll(`[href*="help/contact/contact.html"]`));
                            urlLinkNodes.forEach(elem => param.sellerContactURLs.push(elem.href));
                            //.href;
                            // isInvoice = false;
                            // exportUserLogMsg(`PDFは適格領収書ではないかもしれません`)
                        }
                        let pdfStrs = []
                        for (let i = 0; i < target.length; i++) {
                            let pdfURL = target[i].href
                            let idx = i + 1;
                            /**
                             *
                             * @type {{sellerURL: string, isCreateInvoicePDF: boolean, isQualifiedInvoice: boolean, fileIdx: number, isCachePDF: boolean, invoiceId: string, sellerContactURL: string, qualifiedInvoiceReason: string}}
                             */
                            let copyParam = JSON.parse(JSON.stringify(invoiceListParam));
                            param.invoiceList.push(copyParam);
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
                                param.isCreateInvoicePDF &= pdfResult.isInvoice;
                                param.isCreateInvoicePDF = Boolean(param.isCreateInvoicePDF)
                                copyParam.invoiceId = pdfResult.invoiceId
                                exportUserLogMsg(`PDF情報を解析が終了しました`)
                                if (pdfArrayBuffer) {
                                    if (isPdfGetAndDownload) {
                                        let number = idx > 1?`-${idx-1}`:""
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
                        let id = data.no

                        // PDF自体は作れてる
                        param.isCreateInvoicePDF = true;
                        param.qualifiedInvoiceReason = "作成";
                        let sendVal = {
                            ecName: AMAZON_EC_NAME,
                            orderNumber: data.no,
                            type: "set-ec-pdf-data",
                            pdfStrs,
                            fileName,
                            isInvoice,
                            param
                        };
                        chrome.runtime.sendMessage(sendVal, () => {
                            exportUserLogMsg(`[${id}]のPDF情報のキャッシュが完了しました`)
                        })

                    } else {
                        // param.isCachePDF = false
                        param.isCreateInvoicePDF = false
                        param.isQualifiedInvoice = false

                        // todo .pdfで終わるものが無かったので、ここはエラーを保持して警告出す
                        // A.発送や会計処理終わってないケース
                        // <a class="a-link-normal" hrclassNamegp/help/customer/display.html/ref=oh_aui_ajax_legal_invoice_help?ie=UTF8&amp;nodeId=201986650">
                        //             領収書／購入明細書がご利用になれません。くわしくはこちら。
                        //         </a>
                        invoiceLinkNode.querySelectorAll(`a`)
                        let target = Array.from(invoiceLinkNode.querySelectorAll("a"))
                            .find(a => a.textContent.indexOf("領収書／購入明細書がご利用になれません。") !== -1)
                        if (target) {
                            param.qualifiedInvoiceReason = `未発送・会計処理未済の注文もしくは、電子マネーの注文`
                        } else {
                            param.qualifiedInvoiceReason = `領収書の発行しか出来ず、適格請求書・支払い明細が取得できない注文`
                        }
                        exportUserLogMsg(`${param.qualifiedInvoiceReason}`)
                    }
                }

                resultOrderOutputs.push(createOrderOutputObject(data, param))

            }

            await Thread.sleep(500);
            exportUserLogMsg(`${data.no}の処理が終了しました`)
        }

        // console.log(resultOrderOutputs);

        exportUserLogMsg(`デジタル${includeDigital ? "を含んだ" : "を含まない"}商品のデータ${list.length}件の処理が終了しました`)
        exportUserLogMsg(`結果ページを開きます。`)
        chrome.runtime.sendMessage(
            {type: "invoice-result", site: "Amazon", data: resultOrderOutputs}
        )
    }

    function exportUserLogMsg(msg) {
        viewLogger.log(msg)
    }

    function getInsertTarget() {
        return document.querySelector(`#controlsContainer,.page-tabs`)//,.js-yo-main-content`)
    }

    function isOrderPage() {
        return location.pathname.match('/gp/your-account/order-history')
            || location.pathname.match("/gp/css/order-history")
            || location.pathname.match(`/your-orders/orders`)
    }

    function nowLastYearList() {
        let years = document.querySelector(`#orderFilter,#time-filter`);
        if (!years) return [];
        let select = years.cloneNode(true);
        let filterd = select.querySelectorAll(`[value^="year-"]`)
        filterd.forEach(e => e.removeAttribute("selected"))
        return [filterd[0], filterd[1]];
    }

    function createControlFieldElem() {
        let tmp = document.createElement("div")
        let select = document.createElement("select");
        select.id = EXEC_YEAR_PRODUCT_LIST_ID
        select.innerHTML = `<option value="">選択してください</option>`;

        nowLastYearList().forEach(op => select.appendChild(op));
        select.value = "";
        let wrap = tmp.cloneNode();
        wrap.innerHTML = `<span>表示する年を選択：</span>`
        wrap.appendChild(select);
        tmp.innerHTML = `
        <div>
            <div style="display: flex;gap: .5em">
                <div>
                   ${wrap.innerHTML}
                </div>
                <button id="${EXEC_ELEMENT_ID}">
                ページに表示された注文情報のインボイスデータを作る
                </button>
                <div>
                <label><input type="checkbox" id="${INCLUDE_DIGITAL_CHOICE_ID}">デジタルを含める</label>
                </div>
                <div>
<!--                <label><input type="checkbox" id="${PDF_GET_AND_DOWNLOAD_CHOICE_ID}" checked="checked">PDF取得とダウンロードを同時に行う</label>-->
                </div>
            </div>
            <div style="border: inset 2px #ccc">
            <p style="margin: 0;border-bottom: solid 1px ">ログメッセージ:</p>
            <div id="${LOG_MESSAGE_FIELD}" style="max-height: 3em;overflow-y: scroll;width: 100%;">
            
            </div>
            </div>
        </div>
        `;

        return tmp.children[0];
    }

    function createOrders() {
        let orderNodes = Array.from(document.querySelectorAll(`.js-order-card`))
            .filter(e => !e.parentElement.classList.contains(`js-order-card`));
        /**
         *
         * @type {{date: string, invoiceData: {}, no: string, price: {total: string}, title: string}[]}
         */
        let list = []
        orderNodes.forEach(
            node => {
                let obj = createOrderObject(node);
                if (obj) list.push(obj)
            }
        )
        console.log(list);
        return list
    }

    function filterNonDigitalOrders() {
        return createOrders().filter(d => !d.isDigital)
    }

    function createOrderObject(node) {
        /**
         *
         * @type {{date: string, invoiceData: {}, no: string, isDigital: boolean, price: {total: string}, title: string}}
         */
        let orderObj = {
            no: ""
            , title: []
            , date: ""
            , price: {
                total: ""
            }
            , invoiceData: {}
            , isDigital: false
        }
        orderObj.no = node.querySelector(`.yohtmlc-order-id .value,.yohtmlc-order-id [dir="ltr"]`).textContent.trim()
        // todo 複数ある場合があるので先頭のみ、ただデータとしては取得する可能性あり
        // todo 商品リンクとASINは保持
        let linkNodes = Array.from(node.querySelectorAll("a[href]"))
            .filter(node => node.href.match(/\/[A-Z,0-9]{10}[/|?]/))
        let titles = linkNodes
            .filter(a => !a.querySelector("img"));
        let images = linkNodes
            .filter(a => a.querySelector("img"));
        //.querySelector(`.yohtmlc-item .a-link-normal,.yohtmlc-product-title`).textContent.trim()
        titles.forEach((titleLinkNode, index) => {
            //
            let asin = titleLinkNode.href.match(/\/[A-Z,0-9]{10}[/|?]/)[0]
                .replaceAll("/", "")
                .replaceAll("?", "");
            let href = titleLinkNode.href;
            let title = titleLinkNode.textContent;
            let imageWrapLinkNode = images[index];
            let img = imageWrapLinkNode.querySelector("img");
            let imgSrc = img.getAttribute("data-src") ?
                img.getAttribute("data-src") : img.getAttribute("src");
            orderObj.title.push(
                {asin, href, title, imgSrc}
            )

        })
        //
        orderObj.price.total = node.querySelector(`.yohtmlc-order-total .value,.yohtmlc-order-total`).textContent.trim()
        // ヘッダーの日付フォーマットを取得
        orderObj.date = Array.from(node.querySelectorAll(`.order-header span,.order-info span`)).find(e => e.textContent.trim().match(/[0-9]{4}年[0-9]{1,2}月[0-9]{1,2}日/))
            .textContent.trim()
        // キャンセルの場合、領収書等がでないのでその時点でnull返却
        try {

            orderObj.invoiceData = JSON.parse(
                Array.from(node.querySelectorAll(`.order-info .yohtmlc-order-level-connections [data-a-popover],.order-header .yohtmlc-order-level-connections [data-a-popover]`))
                    .filter(elem => ~elem.textContent.indexOf("領収書"))[0]
                    .getAttribute("data-a-popover"))
        } catch (e) {
            // エラーとなった注文番号は知りたいので、ログに出す
            exportUserLogMsg(`${orderObj.no}は領収書が有りません`)
            return null
        }
        orderObj.isDigital = Boolean(orderObj.no.match(/^D/))
        return orderObj;

    }

}


async function getPDFArrayBuffer(
    url = 'https://www.amazon.co.jp/documents/download/812ccde1-8a52-4f91-a4e3-8d0a9638bc56/invoice.pdf',
    options = {}
) {
    let res = await fetch(url);
    let arrayBuff = await res.arrayBuffer();
    return arrayBuff;
}


function arrayBufferToStringSerializable(arrayBuff) {

    const base64String = arrayBufferToBase64(arrayBuff);
    return base64String
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return window.btoa(binary);
}

function arrayBuffSerializableStringToArrayBuff(str) {
    const newArrayBuffer = base64ToArrayBuffer(str);
    return newArrayBuffer;
}

function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
}

function downloadPDF(arrayBuffer, fileName) {

    // ここでnewArrayBufferを使用する
    const objectUrl = URL.createObjectURL(new Blob([arrayBuffer]));
    const objectLink = document.createElement('a');
    objectLink.href = objectUrl;
    objectLink.setAttribute('download', `${fileName}.pdf`);
    document.body.appendChild(objectLink);
    objectLink.click();
    URL.revokeObjectURL(objectLink.href);
    document.body.removeChild(objectLink);
    // objectLink.revokeObjectURL();
}
