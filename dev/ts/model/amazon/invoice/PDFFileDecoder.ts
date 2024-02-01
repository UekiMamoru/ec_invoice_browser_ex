import {InvoicePDFDecodeResultData, WorkerPdfDecodeData} from "../../../react/types";

export class PDFFileDecoder{
    async invoiceDecode(pdfStr:string){
        // 取得したPDFデータを解析
        let decodeCheck:WorkerPdfDecodeData = {
            type: `pdf-decode`
            , pdfStr
        }
        // exportUserLogMsg(`PDF情報を解析します`)
        /**
         * @type {{ type: string,invoiceId: string,isInvoice: boolean }}
         */
        let pdfResult = await chrome.runtime.sendMessage(
            decodeCheck
        )
        let result:InvoicePDFDecodeResultData = {
            type:pdfResult.type,
            invoiceId:pdfResult.invoiceId,
            isInvoice:pdfResult.isInvoice
        }

        return result;
    }
}