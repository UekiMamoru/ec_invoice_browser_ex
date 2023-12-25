(
    async () => {

        const AMAZON_EC_NAME = "amazon"
        let searchURLSearchParams =new URLSearchParams(window.location.search)
        let ec = searchURLSearchParams.get("ec");
        if(!ec){
            alert("ショップ名が特定できませんでした");
            window.close();
        }
        const EC_NAME = ec
        document.querySelector("#siteName").textContent = EC_NAME;

        let message = await chrome.runtime.sendMessage({type:"get-ec-order-data-list",site:EC_NAME})
        console.log(message)
        // document.querySelector("#resultField").innerHTML = createTable(message.data);
        return
        document.body.addEventListener("click", async (ev) => {
            let target = ev.target.closest(`.qualifiedInvoiceDownload`);

            if (target) {
                let dataIdx = target.getAttribute("data-idx")-0;
                let orderNumber = target.getAttribute("data-order-no");
                let getVal = {
                    ecName: AMAZON_EC_NAME,
                    orderNumber,
                    type: "get-ec-pdf-data",

                }
                let result = await chrome.runtime.sendMessage(getVal);

                // 既にあったので、既存データで作成
                let pdfArrayBuffer;
                // exportUserLogMsg(`キャッシュに存在していたため、キャッシュデータを利用します。`)
                let data = result.data
                let param = result.data.param//.invoiceList;
                //
                data.pdfStrs.forEach((pdfStr, idx) => {
                    if(idx === dataIdx){
                        let fileName = `tmp_${result.data.fileName}${idx > 1 ? idx - 1 : ""}`;
                        pdfArrayBuffer = (arrayBuffSerializableStringToArrayBuff(pdfStr));
                        if (pdfArrayBuffer) {
                            downloadPDF(pdfArrayBuffer, fileName);
                        }
                        pdfArrayBuffer = "";
                    }
                    // param = invoiceListParam;
                });
            }
            return false
        })

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

        function createTable(productDataList) {
            let bodyRow = ""
            productDataList.forEach((productData, idx) => {
                bodyRow += createRow(productData, idx + 1)
            })
            return ` 
            <table>
            <thead>
            ${createHeaderRow()}
            </thead>
            <tbody>
            ${bodyRow}
            </tbody>
            </table>
            `
        }

        function createHeaderRow() {
            return `
            <tr>
            <th>番号</th>
            <th>注文番号</th>
            <th>注文日</th>
            <th>注文合計金額</th>
            <th>注文品</th>
            <th>デジタル</th>
            <th>複数注文</th>
            <th>適格取引</th>
            <th>PDF作成</th>
            <th>適格請求書</th>
            <th>支払明細書</th>
            <th>既に作成済</th>
            </tr>
            `
        }

        /**
         *
         * @param resultData{{invoiceList:[{sellerURL: string, isCreateInvoicePDF: boolean, isQualifiedInvoice: boolean, fileIdx: number, isCachePDF: boolean, invoiceId: string, sellerContactURLs: [string], qualifiedInvoiceReason: string}],date: string, orderNumber: string, isDigital: boolean, sellerURL: (string|*), price: string, isCreateInvoicePDF: (boolean|*), productDataList: string, isQualifiedInvoice: (boolean|*), isCachePDF: (boolean|*), sellerContactURL: (string|*), qualifiedInvoiceReason: (string|*), isMultipleOrder: boolean,invoiceId:string}}
         * @param idx integer
         */
        function createRow(resultData, idx = 0) {
            // todo isCachePDF は配列から取得
            return `
            <tr>
            <td>${idx}</td>
            <td>${createOrderCell(resultData.orderNumber, resultData.isDigital)}</td>
            <td>${resultData.date}</td>
            <td>${priceShaping(resultData.price)}</td>
            <td>${productDataLinks(resultData.productDataList)}</td>
            <td>${resultData.isDigital ? "D" : "-"}</td>
            <td>${resultData.isMultipleOrder ? "multiple" : "-"}</td>
            <td>${qualifiedInvoiceCell(resultData)}</td>
            <td>${resultData.isCreateInvoicePDF}</td>
            <td>${createQualifiedInvoiceField(resultData)}</td>
            <td>${createPaymentDetails(resultData)}</td>
            <td>${resultData.isCachePDF ? "-" : ""}</td>
            </tr>
            `
        }

        /**
         * @param resultData{{invoiceList:[{sellerURL: string, isCreateInvoicePDF: boolean, isQualifiedInvoice: boolean, fileIdx: number, isCachePDF: boolean, invoiceId: string, sellerContactURLs: string[], qualifiedInvoiceReason: string}],date: string, orderNumber: string, isDigital: boolean, sellerURL: (string|*), price: string, isCreateInvoicePDF: (boolean|*), productDataList: string, isQualifiedInvoice: (boolean|*), isCachePDF: (boolean|*), sellerContactURL: (string|*), qualifiedInvoiceReason: (string|*), isMultipleOrder: boolean,invoiceId:string}}
         **/
        function createPaymentDetails(resultData) {
            let invoiceIdsStr = ""
            let invoiceIdHTML = `<table><tbody>`;
            for (let data of resultData.invoiceList) {
                let body = `<tr><td>`
                // if (data.invoiceId) {
                let dlStr = `${Boolean(data.isQualifiedInvoice) === false && data.isCreateInvoicePDF ? "<a>支払い明細DL</a></p>" : ""}`
                body += dlStr;
                invoiceIdsStr += dlStr;
                // }
                // body += link;
                body += `</td></tr>`
                invoiceIdHTML += body;
            }

            let link = `${createSellerContactURL(resultData.sellerContactURLs)}`
            invoiceIdHTML += `</tbody></table>${link}`
            // 何も作れないケース
            if (!invoiceIdsStr) invoiceIdHTML = "";
            return `
            
            ${invoiceIdHTML}
         
            `
        }

        /**
         * @param resultData{{invoiceList:[{sellerURL: string, isCreateInvoicePDF: boolean, isQualifiedInvoice: boolean, fileIdx: number, isCachePDF: boolean, invoiceId: string, sellerContactURL: string, qualifiedInvoiceReason: string}],date: string, orderNumber: string, isDigital: boolean, sellerURL: (string|*), price: string, isCreateInvoicePDF: (boolean|*), productDataList: string, isQualifiedInvoice: (boolean|*), isCachePDF: (boolean|*), sellerContactURL: (string|*), qualifiedInvoiceReason: (string|*), isMultipleOrder: boolean,invoiceId:string}}
         **/
        function createQualifiedInvoiceField(resultData) {
            let invoiceIdsStr = ""
            let invoiceIdHTML = `<table><tbody>`;
            resultData.invoiceList.forEach((data, idx) => {

                let body = `<tr><td>`
                console.log(data)
                if (data.invoiceId) {
                    body = `<p>${data.invoiceId}</p>`
                }
                let link = createQualifiedInvoiceLink(resultData.orderNumber, data, idx)
                invoiceIdsStr += link;
                body += link;
                body += `</td></tr>`
                invoiceIdHTML += body;
            })
            invoiceIdHTML += `</tbody></table>`
            // 何も作れない場合
            if (!invoiceIdsStr) invoiceIdHTML = "-"
            return `
            
            ${invoiceIdHTML}
         
            `
        }

        function createQualifiedInvoiceLink(orderNo, data, idx) {
            if (!data.isQualifiedInvoice) return "";
            let str = `<a class='qualifiedInvoiceDownload' href="#" data-order-no='${orderNo}' data-idx='${idx}'>適格領収書DL</a>`
            return str;
        }

        function createSellerContactURL(urlList = []) {
            if (!urlList.length) return "";
            let result = ""
            urlList.forEach(url => {
                // ストア詳細
                let sellerId = url.match(/sellerID=[A-Z|0-9]*/)[0];
                sellerId = sellerId.replace("sellerID=", "")

                let storeURL = `https://www.amazon.co.jp/sp?seller=${sellerId}`;
                result += `
                    <p>
                    <a href="${url}" target="_blank">ストアにチャットで連絡</a><br/>
                    <a href="${storeURL}" target="_blank">ストアを確認</a>
                    </p>`
            })
            return result;
        }


        /**
         *
         * @param resultData{{date: string, orderNumber: string, isDigital: boolean, sellerURL: (string|*), price: string, isCreateInvoicePDF: (boolean|*), productDataList: string, isQualifiedInvoice: (boolean|*), isCachePDF: (boolean|*), sellerContactURL: (string|*), qualifiedInvoiceReason: (string|*), isMultipleOrder: boolean}}
         */
        function qualifiedInvoiceCell(resultData) {
            let word = "", note = "";
            // 適格領収書　で　かつ　複数注文品がある場合
            if (resultData.isQualifiedInvoice && (resultData.productDataList.length > 1)) {
                // YESだけど注釈
                word = "Yes";
                note = "※Amazonから適格請求書は取得しましたが、複数注文のため記載されていない明細がある可能性があります。"
            } else if (resultData.isQualifiedInvoice) {
                // YES
                word = "Yes";
            } else if (!resultData.isQualifiedInvoice) {
                // 作れなかった場合は最終
                word = "No"
                // PDF自体が作れなかった
                if (!resultData.isCreateInvoicePDF) {
                    word = "不明"
                    note = resultData.qualifiedInvoiceReason ?
                        resultData.qualifiedInvoiceReason : `※何らかの理由で取得できませんでした。<a href="${createOrderDetailPageLink(resultData.orderNumber, resultData.isDigital)}">注文詳細</a>で確認してください`
                }
            }
            return `
            <div>
            <p>${word}</p>
            <span>${note}</span>
            </div>
            `
        }

        /**
         *
         * @param productDataList {   {asin:string, href:string, title:string, imgSrc:string}[]}
         */
        function productDataLinks(productDataList) {
            let listStr = "";
            productDataList.forEach(data => {
                listStr += productDataLink(data)
            })
            return `
            
            <div>
            ${listStr}
             </div>
            `
        }

        /**
         *
         * @param productData{   {asin:string, href:string, title:string, imgSrc:string}}
         */
        function productDataLink(productData) {
            return `
            <div style="display:flex;gap: 3px">
            <div style="width: 48px;height: auto"><img src="${productData.imgSrc}" style="width: auto;max-width: 100%;height: auto"></div>
            <div style="max-width: 10em;max-height: 4.5em;overflow: hidden">
            <a href="${productData.href}" target="_blank">[${productData.asin}]${productData.title}</a>
            </div>
            </div>
            `


        }

        function priceShaping(priceDataStr = "") {
            // 数値だけにする
            let price = Number.parseInt(priceDataStr.replace(/[^0-9]/ig, ""))
            // 通貨フォーマットへ
            return Number(price).toLocaleString('ja-JP', {style: 'currency', currency: 'JPY'});
        }


        function createOrderCell(orderNumber, isDigital = false) {
            return `<div><a href="${createOrderDetailPageLink(orderNumber, isDigital)}" target="_blank">${orderNumber}</a></div>`
        }

        function createOrderDetailPageLink(orderNumber, isDigital = false) {
            return isDigital ? `https://www.amazon.co.jp/gp/digital/your-account/order-summary.html?orderID=${orderNumber}`
                : `https://www.amazon.co.jp/gp/your-account/order-details?orderID=${orderNumber}`
        }
    }
)()