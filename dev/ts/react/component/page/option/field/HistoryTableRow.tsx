import {AmazonOrderProductData, AmazonResultTransferObject} from "../../../../types";
import {HistoryProductDataLink} from "./HistoryProductDataLink";
import {QualifiedInvoiceField} from "./QualifiedInvoiceField";

type AmazonResultTransfer = {
    amazonResultTransferObject: AmazonResultTransferObject, idx: number
}

export const HistoryTableRow = (prop: AmazonResultTransfer) => {
    let {amazonResultTransferObject, idx} = prop;
    return (
        <>
            <tr>
                <td>{idx+1}</td>
                <td>{createOrderCell(amazonResultTransferObject.orderNumber, amazonResultTransferObject.isDigital)}</td>
                <td>{amazonResultTransferObject.date}</td>
                <td>{priceShaping(amazonResultTransferObject.price)}</td>
                <td>{productDataLinks(amazonResultTransferObject.productDataList)}</td>
                <td>{amazonResultTransferObject.isDigital ? "D" : "-"}</td>
                <td>{amazonResultTransferObject.isMultipleOrder ? "multiple" : "-"}</td>
                <td>{qualifiedInvoiceCell(amazonResultTransferObject)}</td>
                <td>{amazonResultTransferObject.isCreateInvoicePDF}</td>
                <td><QualifiedInvoiceField amazonResultTransferObject={amazonResultTransferObject}/></td>
                <td>{createPaymentDetails(amazonResultTransferObject)}</td>
                {/*<td>${amazonResultTransferObject.isCachePDF ? "-" : ""}</td>*/}
            </tr>
        </>
    )
}

function createPaymentDetails(amazonResultTransferObject: AmazonResultTransferObject) {
    let invoiceIdsStr = "";
    let jsxElem = (<></>)
    if (amazonResultTransferObject.invoiceList.length) {

        let invoiceIdHTML = `<table><tbody>`;
        for (let data of amazonResultTransferObject.invoiceList) {
            let body = `<tr><td>`
            let dlStr = `{data.isQualifiedInvoice && data.isCreateInvoicePDF ? "<a>支払い明細DL</a>" : ""}`
            body += dlStr;
            invoiceIdsStr += dlStr;
            body += `</td></tr>`
            invoiceIdHTML += body;
        }
        jsxElem = (
            <>
                <table>
                    <tbody>
                    {createRows(amazonResultTransferObject)}
                    </tbody>
                </table>
                {createSellerContactURL(amazonResultTransferObject.sellerContactURLs)}
            </>
        );
    }
    return jsxElem;
}


function createRows(amazonResultTransferObject: AmazonResultTransferObject) {
    return (
        <>
            {amazonResultTransferObject.invoiceList.map(data => {
                <tr>
                    <td>
                        {data.isQualifiedInvoice && data.isCreateInvoicePDF ? "<a>支払い明細DL</a>" : "<span>-</span>"}
                        <br/>
                    </td>
                </tr>
            })}
        </>)

}

function createSellerContactURL(urlList: string[]) {
    if (!urlList.length) return (<></>);
    return (
        <>

            {urlList.map(url => {
                if (url) {
                    let matched = url.match(/sellerID=[A-Z|0-9]*/);
                    if (matched) {

                        // ストア詳細
                        let sellerId = matched[0];
                        sellerId = sellerId.replace("sellerID=", "")

                        let storeURL = `https://www.amazon.co.jp/sp?seller=${sellerId}`;
                        <p>
                            <a href={url} target="_blank">ストアにチャットで連絡</a><br/>
                            <a href={storeURL} target="_blank">ストアを確認</a>
                        </p>
                    }
                }
            })}
        </>
    )
}


function qualifiedInvoiceCell(amazonResultTransferObject: AmazonResultTransferObject) {
    let word = "", note = "";
    // 適格領収書　で　かつ　複数注文品がある場合
    if (amazonResultTransferObject.isQualifiedInvoice && (amazonResultTransferObject.productDataList.length > 1)) {
        // YESだけど注釈
        word = "Yes";
        note = "※Amazonから適格請求書は取得しましたが、複数注文のため記載されていない明細がある可能性があります。"
    } else if (amazonResultTransferObject.isQualifiedInvoice) {
        // YES
        word = "Yes";
    } else if (!amazonResultTransferObject.isQualifiedInvoice) {
        // 作れなかった場合は最終
        word = "No"
        // PDF自体が作れなかった
        if (!amazonResultTransferObject.isCreateInvoicePDF) {
            word = "不明"
            note = amazonResultTransferObject.qualifiedInvoiceReason ?
                amazonResultTransferObject.qualifiedInvoiceReason : `※何らかの理由で取得できませんでした。<a href="${createOrderDetailPageLink(amazonResultTransferObject.orderNumber, amazonResultTransferObject.isDigital)}">注文詳細</a>で確認してください`
        }
    }
    return (
        <>
            <div>
                <p>{word}</p>
                <span>{note}</span>
            </div>
        </>)
}

/**
 *
 * @param productDataList {   {asin:string, href:string, title:string, imgSrc:string}[]}
 */
function productDataLinks(productDataList: AmazonOrderProductData[]) {
    return (
        <>
            {productDataList.map((value, key) =>
                    <HistoryProductDataLink productData={value} key={key}/>
            )}
        </>
    )
}


function priceShaping(priceDataStr = "") {
    // 数値だけにする
    let price = Number.parseInt(priceDataStr.replace(/[^0-9]/ig, ""))
    // 通貨フォーマットへ
    return Number(price).toLocaleString('ja-JP', {style: 'currency', currency: 'JPY'});
}

function createOrderCell(orderNumber: string, isDigital = false) {
    let url = createOrderDetailPageLink(orderNumber, isDigital);
    return (<div><a href={url} target="_blank">{orderNumber}</a></div>);
}

function createOrderDetailPageLink(orderNumber: string, isDigital = false) {
    return isDigital ? `https://www.amazon.co.jp/gp/digital/your-account/order-summary.html?orderID=${orderNumber}`
        : `https://www.amazon.co.jp/gp/your-account/order-details?orderID=${orderNumber}`
}