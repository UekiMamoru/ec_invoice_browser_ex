import {CSVDataCreator} from "../../../lib/CSVDataCreator";
import {AmazonResultTransferObject} from "../../../react/types";
import {DownloadFileNameCreator} from "../../util/DownloadFileNameCreator";

export class CreateAmazonHistoryDataToCSVDataCreator extends CSVDataCreator {
    private _downloadFileNameCreator: DownloadFileNameCreator;

    constructor() {
        super();
        this.headerDataArr = [
            "EC", "注文日", "注文番号", "商品名(ASIN)","合計金額", "適格番号/支払い明細", "ファイル名"
        ]
        this._downloadFileNameCreator = new DownloadFileNameCreator("amazon");
    }

    convertToAddLine(amazonResultTransferObject: AmazonResultTransferObject, fileType: string = ".pdf") {
        // invoiceListが無ければスキップ
        if (!amazonResultTransferObject.invoiceList.length) return;
        // 以下インボイスリスト分繰り返す
        amazonResultTransferObject.invoiceList.forEach((val, index) => {

            let orderNumber = amazonResultTransferObject.orderNumber;
            let date = amazonResultTransferObject.date;
            let products = ``;
            amazonResultTransferObject.productDataList.forEach(p => {
                products += `【${p.title.trim()}(${p.asin})】::`
            });
            let price = amazonResultTransferObject.price;
            price = price.replace(/[^0-9,]/ig, "")

            products = products.replace(/::$/, "");
            let invoiceId = val.invoiceId ? val.invoiceId : "支払い明細";
            let fileName = this._downloadFileNameCreator.createFileNameAmazonResultTransferObject(amazonResultTransferObject, index > 0 ? index : undefined);
            this.addLine([
                "amazon"
                , date
                , orderNumber
                , products
                , price
                , invoiceId
                , fileName + fileType])
        })
    }

}