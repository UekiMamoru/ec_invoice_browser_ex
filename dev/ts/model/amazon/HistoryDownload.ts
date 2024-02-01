import {
    AmazonInvoiceObj,
    AmazonOrderDataObj,
    AmazonResultTransferObject,
    ExportPDFBinaryFile
} from "../../react/types";
import {Thread} from "../../react/component/util/Thread";
import {DownloadFileNameCreator} from "../util/DownloadFileNameCreator";
import {DateConverter} from "../../lib/DateConverter";
import {PDFBufferData} from "../PDFBufferData";
import {AmazonPDFNodeFinder} from "./AmazonPDFNodeFinder";
import {InvoiceDataCreator} from "./invoice/InvoiceDataCreator";
import {FileExporter} from "../../lib/export/FileExporter";
import {ZipFileExporter} from "../../lib/export/ZipFileExporter";
import {PDFFileExporter} from "../../lib/export/PDFFileExporter";
import {Logger} from "../../lib/Logger";


export class HistoryDownload {
    private _downloadFileNameCreator: DownloadFileNameCreator;
    private _dateConverter: DateConverter;
    private _amazonPDFNodeFinder: AmazonPDFNodeFinder;
    private _invoiceDataCreator: InvoiceDataCreator;
    private _exporter: FileExporter;
    private _isZip: boolean = true;
    private _logger :Logger;

    constructor() {
        this._downloadFileNameCreator = new DownloadFileNameCreator("amazon");
        this._dateConverter = new DateConverter();
        this._amazonPDFNodeFinder = new AmazonPDFNodeFinder();
        this._invoiceDataCreator = new InvoiceDataCreator();
        this._exporter = this.getFileExporter(this._isZip);
        this._logger = new Logger()
    }

    private getFileExporter(isZip: boolean): FileExporter {
        if (isZip) return new ZipFileExporter();
        return new PDFFileExporter();
    }

    set isZip(_: boolean) {
        this._isZip = _;
    }
    set logger(_:Logger){
        this._logger =_;
        this._invoiceDataCreator.logger = _;
    }

    private exportUserLogMsg(msg:string){
        this._logger.log(msg);
    }
    async exec(amazonOrderDataObjList: AmazonOrderDataObj[]) {
        this._exporter = this.getFileExporter(this._isZip);
        let ym = "";
        const AMAZON_EC_NAME = "amazon";
        let resultOrderOutputs: AmazonResultTransferObject[] = [];
        let writeExportPDFBinaryFiles: ExportPDFBinaryFile[] = [];
        for (const amazonOrderDataObj of amazonOrderDataObjList) {
            // リセット
            writeExportPDFBinaryFiles = [];
            ym = this._dateConverter.strJpFormatToYYYYMM(amazonOrderDataObj.date);
            if (amazonOrderDataObj) {
                this.exportUserLogMsg(`注文番号${amazonOrderDataObj.no}の処理を開始します`)
                let isInvoice = false;
                // todo 当該注文番号に紐づくシリアライズしたデータがあるかチェック
                let getVal = {
                    ecName: AMAZON_EC_NAME,
                    orderNumber: amazonOrderDataObj.no,
                    type: "get-ec-pdf-data",
                }
                let amazonInvoiceObj: AmazonInvoiceObj = this.createAmazonInvoiceObj();
                let result = await chrome.runtime.sendMessage(getVal);
                // 既にあったので、既存データで作成
                if (result.state) {
                    amazonInvoiceObj = result.data.amazonInvoiceObj
                    let pdfStrs = result.data.pdfStrs;

                    writeExportPDFBinaryFiles = await this.createDataFromCache(amazonOrderDataObj, pdfStrs);
                } else {
                    let invoiceURL = amazonOrderDataObj.invoiceData.url;   // invoice.pdfで判定するが、複数あるケースやインボイスでない場合がある

                    let fileName = await this._downloadFileNameCreator.createFileName(amazonOrderDataObj)
                    let finderResult = await this._amazonPDFNodeFinder.find(invoiceURL);


                    if (finderResult.target.length) {
                        this.exportUserLogMsg(`${amazonOrderDataObj.no}のオーダーは${finderResult.target.length}件データが見つかりました`)
                        // もし、「請求書をリクエスト」が存在したら、適格領収書ではない可能性あり
                        let sellerContactURLs = this._amazonPDFNodeFinder.getSellerContactURLs(finderResult.invoiceLinkDocument);
                        let targets = finderResult.target;
                        amazonInvoiceObj.sellerContactURLs = sellerContactURLs;
                        let urls: string[] = targets.map(t => t.href);
                        let {
                            isQualifiedInvoice,
                            pdfStrs,
                            invoiceList,
                            exportPDFBinaryFiles
                        } = await this._invoiceDataCreator.createInvoiceDataList(urls, fileName)
                        amazonInvoiceObj.isQualifiedInvoice &&= isQualifiedInvoice;
                        amazonInvoiceObj.invoiceList = invoiceList;
                        writeExportPDFBinaryFiles = exportPDFBinaryFiles;
                        this.exportUserLogMsg(`PDF情報をキャッシュします`)
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
                            this.exportUserLogMsg(`[${id}]のPDF情報のキャッシュが完了しました`)
                        })

                    } else {
                        // param.isCachePDF = false
                        amazonInvoiceObj.isCreateInvoicePDF = false
                        amazonInvoiceObj.isQualifiedInvoice = false

                        if (this._amazonPDFNodeFinder.isReceipt(finderResult.invoiceLinkDocument)) {
                            amazonInvoiceObj.qualifiedInvoiceReason = `未発送・会計処理未済の注文もしくは、電子マネーの注文`
                        } else {
                            amazonInvoiceObj.qualifiedInvoiceReason = `領収書の発行しか出来ず、適格請求書・支払い明細が取得できない注文`
                        }
                        this.exportUserLogMsg(`${amazonInvoiceObj.qualifiedInvoiceReason}`)
                    }
                }

                resultOrderOutputs.push(this.createOrderOutputObject(amazonOrderDataObj, amazonInvoiceObj))
                this.export(writeExportPDFBinaryFiles, ym)
            }

            await Thread.sleep(300);
            this.exportUserLogMsg(`${amazonOrderDataObj.no}の処理が終了しました`)
        }
        this._exporter.flash();
        return resultOrderOutputs;
    }

    private export(writeExportPDFBinaryFiles: ExportPDFBinaryFile[], ym: string) {
        writeExportPDFBinaryFiles.forEach(data => {
            this._exporter.export(data, {val: ym})
        })
    }

    private createAmazonInvoiceObj() {
        let amazonInvoiceObj: AmazonInvoiceObj = {
            isQualifiedInvoice: true,
            isCreateInvoicePDF: true,
            qualifiedInvoiceReason: "",
            sellerContactURLs: [],
            invoiceList: [],
        }
        return amazonInvoiceObj;
    }

    async createDataFromCache(amazonOrderDataObj: AmazonOrderDataObj, pdfStrs: string[]) {
        let idx = 0;
        let arrayBuffer: ArrayBufferLike | null = null;
        let exportPDFBinaryFiles: ExportPDFBinaryFile[] = [];
        for (let pdfStr of pdfStrs) {
            let fileName = await this._downloadFileNameCreator.createFileName(amazonOrderDataObj, idx > 1 ? idx - 1 : "");
            idx++;
            arrayBuffer = (this.arrayBuffSerializableStringToArrayBuff(pdfStr));
            if (arrayBuffer !== null) {
                exportPDFBinaryFiles.push({arrayBuffer, fileName})
                // if (isPdfGetAndDownload) {
                //     downloadPDF(arrayBuffer, fileName);
                // } else if (isMonthZIP) {
                //     // zipに追加
                //     zipDataList.push({fileName, data: arrayBuffer})
                // }
            }
            arrayBuffer = null;
        }
        return exportPDFBinaryFiles;
    }

    private  arrayBuffSerializableStringToArrayBuff(str: string) {
        return PDFBufferData.arrayBuffSerializableStringToArrayBuff(str);
    }


    /**
     *
     * @param orderObj
     * @param param
     */
    private  createOrderOutputObject(orderObj: AmazonOrderDataObj, param: AmazonInvoiceObj): AmazonResultTransferObject {
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

}