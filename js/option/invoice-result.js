(
    () => {

        chrome.runtime.onMessage.addListener((message, sender, callback) => {
            if (message.type === "invoice-result") {
                let site = message.site
                document.querySelector("#siteName").textContent = site;
                document.querySelector("#resultField").innerHTML = createTable(message.data);
            }
        })

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
         * @param resultData{{date: string, orderNumber: string, isDigital: boolean, sellerURL: (string|*), price: string, isCreateInvoicePDF: (boolean|*), productDataList: string, isQualifiedInvoice: (boolean|*), isCachePDF: (boolean|*), sellerContactURL: (string|*), qualifiedInvoiceReason: (string|*), isMultipleOrder: boolean,invoiceId:string}}
         * @param idx integer
         */
        function createRow(resultData, idx = 0) {
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
            <td>${resultData.isQualifiedInvoice === false && resultData.isCreateInvoicePDF ? "<a>支払い明細DL</a></p>" : ""}
            ${createSellerContactURL(resultData.sellerContactURL)}
            </td>
            <td>${resultData.isCachePDF}</td>
            </tr>
            `
        }
        function createQualifiedInvoiceField(resultData){
            let invoiceId = resultData.invoiceId;
            let invoiceIdHTML = ``
            if(invoiceId){
                invoiceIdHTML = `<p>${invoiceId}</p>`
            }
            return `
            ${resultData.isQualifiedInvoice ? "<a >適格領収書DL</a>" : ""}
            ${invoiceIdHTML}
            `
        }
        function createSellerContactURL(url){
            if(!url)return "";
            // ストア詳細
            let sellerId = url.match(/sellerID=[A-Z|0-9]*/)[0];
            sellerId = sellerId.replace("sellerID=","")

            let storeURL = `https://www.amazon.co.jp/sp?seller=${sellerId}`;
            return  `
            <p>
            <a href="${url}" target="_blank">ストアにチャットで連絡</a><br/>
            <a href="${storeURL}" target="_blank">ストアを確認</a>
            </p>
            `
        }


        /**
         *
         * @param resultData{{date: string, orderNumber: string, isDigital: boolean, sellerURL: (string|*), price: string, isCreateInvoicePDF: (boolean|*), productDataList: string, isQualifiedInvoice: (boolean|*), isCachePDF: (boolean|*), sellerContactURL: (string|*), qualifiedInvoiceReason: (string|*), isMultipleOrder: boolean}}
         */
        function qualifiedInvoiceCell(resultData) {
            let word = "", note = "";
            // 適格領収書　で　かつ　複数注文品がある場合
            resultData.isQualifiedInvoice
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