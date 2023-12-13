/*
<span className="a-declarative" data-action="a-popover"
      data-a-popover="{&quot;url&quot;:&quot;/gp/shared-cs/ajax/invoice/invoice.html?orderId=503-3116098-9223044&amp;relatedRequestId=0VHQAVNXESE1GPZQFT6Q&amp;isADriveSubscription=&amp;isBookingOrder=0&quot;,&quot;position&quot;:&quot;triggerBottom&quot;,&quot;ajaxFailMsg&quot;:&quot;\n\u003cdiv class=\&quot;a-box a-alert-inline a-alert-inline-warning\&quot;>\u003cdiv class=\&quot;a-box-inner a-alert-container\&quot;>\u003ci class=\&quot;a-icon a-icon-alert\&quot;>\u003c/i>\u003cdiv class=\&quot;a-alert-content\&quot;>\n        \u003cspan class=\&quot;a-text-bold\&quot;>\n            請求書の取得中に問題がありました。\n        \u003c/span>\n\u003c/div>\u003c/div>\u003c/div>\n\u003cdiv class=\&quot;a-row a-spacing-top-mini\&quot;>\n    ご注文については、注文の詳細をご覧ください。\n\u003c/div>\n\u003cdiv class=\&quot;a-row\&quot;>\n    \u003ca class=\&quot;a-link-emphasis\&quot; href=\&quot;/gp/your-account/order-details/ref=oh_aui_invorder_details?ie=UTF8&amp;orderID=503-3116098-9223044\&quot;>注文内容を表示\u003c/a>\n\u003c/div>\n&quot;,&quot;activate&quot;:&quot;onclick&quot;}">
    <a href="javascript:void(0)" className="a-popover-trigger a-declarative">
        領収書等
    <i className="a-icon a-icon-popover"></i></a>
</span>
 */
const AMAZON_EC_NAME = "amazon"
amazonOrderPage()

function amazonOrderPage() {

    if (!isOrderPage()) {
        return;
    }
    let src = `/gp/your-account/order-history/ref=ppx_yo_dt_b_pagination_1_2?ie=UTF8&orderFilter=year-2023&search=&startIndex=10`;

    // 1000秒後にiframeで注文ぺージを開く
    // iframe
    let iframe = document.createElement("iframe");

    // setTimeout(() => {
    //     document.body.appendChild(iframe)
    //     iframe.src = `/gp/your-account/order-history/ref=ppx_yo_dt_b_pagination_1_2?ie=UTF8&orderFilter=year-2023&search=&startIndex=10`
    // }, 1000)

    // return;
    const EXEC_ELEMENT_ID = `ecInvoiceExec`;
    const EXEC_YEAR_PRODUCT_LIST_ID = `ecYearProductListExec`;
    // オーダーページなので、デジタル以外
    // 動作用フィールドを挿入する
    // todo 動的にページが更新されるので、以降はbodyの更新タイミングで挿入ノードが生きているか監視
    let insertNode = createControlFieldElem();
    let t = getInsertTarget()
    t.prepend(insertNode);
    addEvent();

    function addEvent() {
        let ev = createList;
        let changeEv = createYearList
        document.body.addEventListener("click", ev);
        document.body.addEventListener("change", changeEv);
    }

    async function createYearList(event) {
        let target = event.target.closest(`#${EXEC_YEAR_PRODUCT_LIST_ID}`);
        if (!target) return
        let year = target.value;
        if (!year) return;
        console.log(event);
        year = year.trim().replaceAll(/[^0-9]/ig, "")
        // まず、1ページ目を取得
        // 1ページ目の戻りで最後のページデータを取得
        // ページデータ取得後、2ページ目以降のアクセス用URLをリストで生成
        // iframe で平行処理


        // 1ページ目のデータ取得用URL生成
        let src = `/gp/your-account/order-history?orderFilter=year-${year}`;
        // 開けたフレーム
        let openFrames = new Map();
        // URLをキーとして、INDEXをVALUEで保持しておく
        let openFrameMessageResultStack = {}
        // 挿入済みのIndex
        let insertedIndex = 1;
        let callback = (urls) => {
            console.log(urls)
            // 3つずつくらいiframeで取得する
            // iframe とメッセージやり取りをするためのイベントをアタッチ

            let messageEventFunc = (event) => {
                if (event.data.hasOwnProperty("href") &&
                    event.data.href.replace(location.origin, "") === src) {
                    if (event.data.state) {

                        // 取得データ
                        let parser = new DOMParser();
                        let node = parser.parseFromString(event.data.nodeStr, "text/html")
                        let list = Array.from(node.querySelectorAll(".order.js-order-card"))
                        let container = document.getElementById("ordersContainer");
                        let cards = Array.from(container.querySelectorAll(".js-order-card"))
                            .filter(elem => {
                                return !elem.parentElement.classList.contains("js-order-card");
                            })
                        let card = cards[cards.length - 1];
                        // 一番最後を取得
                        if (list.length) card.after(...list)

                        // 対応するフレームの削除

                    }
                }
            }

            // window.addEventListener(
            //     "message",
            //     messageEventFunc,
            //     false,
            // );

            // document.body.appendChild(firstFrame)
            // 順番通りアクセスしないと時系列が崩れるので、取得データは一旦スタックに入れ、intervalで挿入処理をする
            // let clear = setInterval(() => {
            //     if (openFrames.length === 0) {
            //         // 終了
            //         // ローダー止める
            //         clearInterval(clear)
            //     }
            //
            // }, 30)
        }
        let firstFrame = document.createElement("iframe");

        let func = (event) => {
            if (event.data.hasOwnProperty("href") &&
                event.data.href.replace(location.origin, "") === src) {
                if (event.data.state) {
                    // データが取れたので、イベントをデタッチ
                    window.removeEventListener("message", func, false);
                    // 取得データをパージ
                    // 現在の履歴一覧を削除
                    document.querySelectorAll(`.order-card.js-order-card,.order.js-order-card`).forEach(e => e.parentElement.removeChild(e));
                    let parser = new DOMParser();
                    let node = parser.parseFromString(event.data.nodeStr, "text/html")
                    let list = Array.from(node.querySelectorAll(".order.js-order-card"))
                    let container = document.querySelector("#ordersContainer,.js-yo-main-content");
                    list.forEach(e => container.appendChild(e));
                    // ページネーションから終端を取得
                    let lastIndex = event.data.lastIndex;
                    // 開いたフレームの削除
                    document.body.removeChild(firstFrame);
                    // ページネーションが存在しない可能性があるので、例外処理
                    try{
                        // ページを移動しない様にページネーションをhide
                        document.querySelector(".a-pagination").style.display = "none";
                    }catch (e){

                    }
                    // lastIndexからURLを生成してコールバック呼び出し
                    callback(createAccessURLs(year, lastIndex))

                }
            }
        };
        window.addEventListener(
            "message",
            func,
            false,
        );

        firstFrame.src = src;
        document.body.appendChild(firstFrame);

        // let lastIndex = 40;
        // console.log(createAccessURLs(year, lastIndex))


    }

    function createAccessURLs(year = "", lastIndex = 1) {
        let urls = []
        for (let i = 1; i <= lastIndex; i++) {
            urls.push(createAccessURL(year, i))
        }
        return urls;
    }

    function createAccessURL(year = "", page = 0) {
        let baseURL = `/gp/your-account/order-history?orderFilter=year-${year}`
        if (page) {
            baseURL += `&startIndex=${page * 10}`
        }
        return baseURL
    }

    async function createList(event) {
        if (!event.target.closest(`#${EXEC_ELEMENT_ID}`)) return
        // デジタル以外を取得
        let list = filterNonDigitalOrders();
        // await list.forEach(async (data) => {
        let data = list.shift();
        if (data) {
            let fileName = `amazon_${data.date}_${data.no}`
            // todo 当該注文番号に紐づくシリアライズしたデータがあるかチェック
            let getVal = {
                ecName: AMAZON_EC_NAME,
                orderNumber: data.no,
                type: "get-ec-pdf-data",

            }
            let result = await chrome.runtime.sendMessage(getVal);
            // 既にあったので、既存データで作成
            let pdfArrayBuffer;
            if (result.state) {
                let pdfStr = result.data.pdfStr;
                pdfArrayBuffer = arrayBuffSerializableStringToArrayBuff(pdfStr)
            } else {
                let url = `https://www.amazon.co.jp${data.invoiceData.url}`;
                // urlをフェッチリクエストしてPDFリンクを生成
                let res = await fetch(url);
                let text = await res.text();
                let parser = new DOMParser();
                let target = parser.parseFromString(text, "text/html")
                    .querySelector(`.invoice-list a[href$="invoice.pdf"]`);
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


                if (target) {
                    let pdfURL = target.href;
                    pdfArrayBuffer = await getPDFArrayBuffer(pdfURL);
                    // stringへ変換
                    let pdfStr = arrayBufferToStringSerializable(pdfArrayBuffer);

                    let sendVal = {
                        ecName: AMAZON_EC_NAME,
                        orderNumber: data.no,
                        type: "set-ec-pdf-data",
                        pdfStr
                    };
                    chrome.runtime.sendMessage(sendVal, () => {
                    })
                    // console.log(serializable)
                } else {
                    // todo .pdfで終わるものが無かったので、ここはエラーを保持して警告出す
                    // 会計処理終わってないケース
                    // <a class="a-link-normal" hrclassNamegp/help/customer/display.html/ref=oh_aui_ajax_legal_invoice_help?ie=UTF8&amp;nodeId=201986650">
                    //             領収書／購入明細書がご利用になれません。くわしくはこちら。
                    //         </a>

                }
            }
            if (pdfArrayBuffer) {
                downloadPDF(pdfArrayBuffer, fileName);
            } else {
                // 何らかのエラーでpdfArrayBufferが作れなかった
            }
        }
        // })
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
        let select = document.querySelector(`#orderFilter,#time-filter`).cloneNode(true);
        let filterd = select.querySelectorAll(`[value^="year-"]`)
        filterd.forEach(e => e.removeAttribute("selected"))
        return [filterd[0], filterd[1]];
    }

    function createControlFieldElem() {
        let tmp = document.createElement("div")
        let select = document.createElement("select");
        select.id = EXEC_YEAR_PRODUCT_LIST_ID
        select.innerHTML = `<option value="">選択してください</option>`
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
            ページに表示された注文情報の領収書データを作る
            </button>
        </div>
        </div>
        `;

        return tmp.children[0];
    }

    function filterNonDigitalOrders() {
        let orderNodes = document.querySelectorAll(`.js-order-card`);
        /**
         *
         * @type {{date: string, invoiceData: {}, no: string, price: {total: string}, title: string}[]}
         */
        let list = []
        orderNodes.forEach(
            node => list.push(createOrderObject(node))
        )
        console.log(list);
        return list.filter(d => !d.no.match(/^D/))
    }

    function createOrderObject(node) {
        /**
         *
         * @type {{date: string, invoiceData: {}, no: string, price: {total: string}, title: string}}
         */
        let orderObj = {
            no: ""
            , title: ""
            , date: ""
            , price: {
                total: ""
            }
            , invoiceData: {}
        }
        orderObj.no = node.querySelector(`.yohtmlc-order-id .value,.yohtmlc-order-id [dir="ltr"]`).textContent.trim()
        // todo 複数ある場合があるので先頭のみ、ただデータとしては取得する可能性あり
        // todo 商品リンクとASINは保持
        orderObj.title = node.querySelector(`.yohtmlc-item .a-link-normal,.yohtmlc-product-title`).textContent.trim()
        //
        orderObj.price.total = node.querySelector(`.yohtmlc-order-total .value,.yohtmlc-order-total`).textContent.trim()
        // ヘッダーの日付フォーマットを取得
        orderObj.date = Array.from(node.querySelectorAll(`.order-header span,.order-info span`)).find(e => e.textContent.trim().match(/[0-9]{4}年[0-9]{1,2}月[0-9]{1,2}日/))
            .textContent.trim()

        orderObj.invoiceData = JSON.parse(
            Array.from(node.querySelectorAll(`.order-info .yohtmlc-order-level-connections [data-a-popover],.order-header .yohtmlc-order-level-connections [data-a-popover]`))
                .filter(elem => ~elem.textContent.indexOf("領収書"))[0]
                .getAttribute("data-a-popover"))
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


function arrayBuffSerializableStringToArrayBuff(str) {
    const newArrayBuffer = base64ToArrayBuffer(str);
    return newArrayBuffer;
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
