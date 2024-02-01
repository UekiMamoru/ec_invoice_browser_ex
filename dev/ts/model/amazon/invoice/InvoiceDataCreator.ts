import {AmazonInvoiceDataParamObj, AmazonInvoiceObj, ExportPDFBinaryFile} from "../../../react/types";
import {BinaryDownloader} from "./BinaryDownloader";
import {PDFBufferData} from "../../PDFBufferData";
import {PDFFileDecoder} from "./PDFFileDecoder";
import {Logger} from "../../../lib/Logger";

export class InvoiceDataCreator {

    private _binaryDownloader: BinaryDownloader;
    private _fileDecoder: PDFFileDecoder;
    private _logger:Logger;
    
    constructor() {
        this._binaryDownloader = new BinaryDownloader();
        this._fileDecoder = new PDFFileDecoder();
        this._logger = new Logger();
    }
    
    set logger(_:Logger){
        this._logger = _;
    }

    private exportUserLogMsg(msg:string){
        this._logger.log(msg);
    }

    async createInvoiceDataList(urls: string[], baseFileName: string) {
        let invoiceList: AmazonInvoiceDataParamObj[] = []
            , pdfStrs: string[] = []
            , isQualifiedInvoice: boolean = true
            , exportPDFBinaryFiles: ExportPDFBinaryFile[] = [];
        for (let i = 0; i < urls.length; i++) {
            let pdfURL = urls[i];
            /// targets[i].href
            let idx = i + 1;
            let amazonInvoiceDataParamObj = this.createAmazonInvoiceDataParamObj();
            amazonInvoiceDataParamObj.fileIdx = idx;
            let arrayBuffer: ArrayBufferLike;
            try {
                // PDF　URLが複数ある可能性があるので、リスト化する

                this.exportUserLogMsg(`PDF情報${idx}番目の取得を開始します`)
                arrayBuffer = await this._binaryDownloader.getPDFArrayBuffer(pdfURL);
                this.exportUserLogMsg(`PDF情報を取得しました`)
                // // stringへ変換
                let pdfStr = this.arrayBufferToStringSerializable(arrayBuffer);
                pdfStrs.push(pdfStr);

                this.exportUserLogMsg(`PDF情報を解析します`)
                /**
                 * @type {{ type: string,invoiceId: string,isInvoice: boolean }}
                 */
                let pdfResult = await this._fileDecoder.invoiceDecode(pdfStr)
                // PDF自体は出来ている
                amazonInvoiceDataParamObj.isCreateInvoicePDF = true;
                // 適格invoiceかどうか
                amazonInvoiceDataParamObj.isQualifiedInvoice = pdfResult.isInvoice;
                // 1個でも適格じゃなかったら適格じゃないと判断するため組み合わせ
                isQualifiedInvoice &&= pdfResult.isInvoice;
                // amazonInvoiceObj.isCreateInvoicePDF = Boolean(amazonInvoiceObj.isCreateInvoicePDF)
                amazonInvoiceDataParamObj.invoiceId = pdfResult.invoiceId
                this.exportUserLogMsg(`PDF情報を解析が終了しました`)
                if (arrayBuffer) {
                    let number = idx > 1 ? `-${idx - 1}` : ""
                    let fileName = `${baseFileName}${number}`
                    let exportPDFBinaryFile: ExportPDFBinaryFile = {
                        fileName, arrayBuffer
                    }
                    // invoiceList.push({fi})
                    exportPDFBinaryFiles.push(exportPDFBinaryFile);
                } else {
                    // 何らかのエラーでpdfArrayBufferが作れなかったので、エラーとして注文番号を注文番号を保持

                }
                console.log(pdfResult);
            } catch (e) {
                // PDF自体はあったが、制作過程で何らかのエラーが生じ作れなかった
                this.exportUserLogMsg(`PDF情報取得時にエラーが発生し取得できませんでした。`)
                amazonInvoiceDataParamObj.qualifiedInvoiceReason = "取得エラー";
            }
            invoiceList.push(amazonInvoiceDataParamObj);
        }
        return {
            invoiceList
            , pdfStrs
            , isQualifiedInvoice
            , exportPDFBinaryFiles

        }
    }


    createAmazonInvoiceDataParamObj(): AmazonInvoiceDataParamObj {
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

    arrayBufferToStringSerializable(arrayBuffer: ArrayBufferLike) {
        return PDFBufferData.arrayBufferToStringSerializable(arrayBuffer);
    }
}