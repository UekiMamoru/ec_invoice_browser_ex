import {PDFBufferData} from "../../../../../model/PDFBufferData";
import {PDFDownloader} from "../../../../../model/PDFDownloader";

type OrderType = { orderNo: string, idx: number }
const AMAZON_EC_NAME = "amazon"
export const QualifiedNonInvoiceLink = (prop: OrderType) => {

    let {orderNo, idx} = prop;
    return (
        <>
            <a onClick={
                () => download(orderNo, idx)
            }>支払い明細</a>
        </>
    )
}

async function download(orderNumber: string, dataIdx: number) {

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
    //
    data.pdfStrs.forEach((pdfStr: string, idx: number) => {
        if (idx === dataIdx) {
            let fileName = `tmp_${result.data.fileName}${idx > 1 ? idx - 1 : ""}`;
            pdfArrayBuffer = (PDFBufferData.arrayBuffSerializableStringToArrayBuff(pdfStr));
            if (pdfArrayBuffer) {
                PDFDownloader.downloadPDF(pdfArrayBuffer, fileName);
            }
            pdfArrayBuffer = "";
        }
        // param = invoiceListParam;
    });
}