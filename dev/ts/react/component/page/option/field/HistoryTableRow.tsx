import {AmazonOrderProductData, AmazonResultTransferObject} from "../../../../types";
import {HistoryProductDataLink} from "./HistoryProductDataLink";
import {QualifiedInvoiceField} from "./QualifiedInvoiceField";
import {QualifiedNonInvoiceLink} from "./QualifiedNonInvoiceLink";
import {CombinePDFModel} from "../../../../../model/CombinePDFModel";

type AmazonResultTransfer = {
    amazonResultTransferObject: AmazonResultTransferObject,
    idx: number,
    combinePDFModel: CombinePDFModel,
    createInput: boolean
}

export const HistoryTableRow = (prop: AmazonResultTransfer) => {
    let {amazonResultTransferObject, idx, combinePDFModel, createInput} = prop;
    return (
        <>
            <tr>
                {createInput ?
                    <td>
                        {amazonResultTransferObject.isQualifiedInvoice ? <input type="checkbox"
                                                                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                                                                    let a = {
                                                                                        index: idx + "",
                                                                                        orderNumber: amazonResultTransferObject.orderNumber
                                                                                    }
                                                                                    if (event.currentTarget.checked) {
                                                                                        // 追加できなかったらチェックを外す
                                                                                        event.currentTarget.checked = combinePDFModel.add(a);
                                                                                    } else {
                                                                                        combinePDFModel.remove(a);
                                                                                    }
                                                                                }}/> : <span>-</span>}
                    </td>
                    : ""
                }
                <td>{idx + 1}</td>
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
        jsxElem = (
            <>
                <table>
                    <tbody>
                    {createRows(amazonResultTransferObject)}
                    </tbody>
                </table>
                {createSellerContactURL(amazonResultTransferObject, amazonResultTransferObject.sellerContactURLs)}
            </>
        );
    }
    return jsxElem;
}


function createRows(amazonResultTransferObject: AmazonResultTransferObject) {
    return (
        <>
            {amazonResultTransferObject.invoiceList.map((data, num) => {
                if ((data.isQualifiedInvoice === false) && data.isCreateInvoicePDF) {
                    return (
                        <tr key={num}>
                            <td>
                                <QualifiedNonInvoiceLink orderNo={amazonResultTransferObject.orderNumber}
                                                         idx={num}/>
                            </td>
                        </tr>)
                }
            })}
        </>)

}

function createSellerContactURL(amazonResultTransferObject: AmazonResultTransferObject, urlList: string[]) {
    if (!urlList.length) return (<></>);
    // 適格請求書だけならリンクもつらない
    if (amazonResultTransferObject.isQualifiedInvoice) return (<></>);
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
                        return (<p key={url}>
                            <a href={url} target="_blank">ストアにAmazonチャットで連絡</a><br/>
                            <a href={storeURL} target="_blank">Amazonでのストア情報を確認</a>
                        </p>)
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