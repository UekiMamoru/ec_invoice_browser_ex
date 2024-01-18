import {HistoryDataStorage} from "../db/HistoryDataStorage";
import {AmazonInvoiceObj, AmazonOrderDataObj, AmazonResultTransferObject} from "../react/types";

export class OrderHistoryDataModel {
    private _siteName: string = "";
    private _historyDataStorage: HistoryDataStorage;
    private _lastPromiseMap!: Map<string, HistoryResult>;

    constructor() {
        this._historyDataStorage = new HistoryDataStorage();
        this._lastPromiseMap = new Map<string, HistoryResult>()
    }

    historyData(ecName: string): HistoryResult {
        let ecPageData = this._lastPromiseMap.get(ecName);
        if (ecPageData) {
            return ecPageData;
        }
        let promise = this._historyDataStorage.getEcAll(ecName);
        ecPageData = {
            status: false, promise, data: []
        }
        this._lastPromiseMap.set(ecName, ecPageData)
        promise.then((data: { [key: string]: any }) => {
            if (ecPageData) {
                ecPageData.data = this.objectConvert(data);
                ecPageData.status = true;
            }
        }).catch(e => {
            if (ecPageData) {
                ecPageData.status = false;
            }
        })
        return ecPageData
    }

    objectConvert(data: { [key: string]: any }) {
        let type: AmazonResultTransferObject[] = [];
        // valueをリスト化
        let values = Object.values(data);
        values.forEach(val => {
            type.push(createOrderOutputObject(val.amazonOrderDataObj, val.amazonInvoiceObj));
        })
        let result = type.sort((obj1, obj2) => {
            let dateA = obj1.date.replace("年", "/").replaceAll("月", "/").replace("日", "")
            let dateB = obj2.date.replace("年", "/").replaceAll("月", "/").replace("日", "")
            return new Date(dateA) > new Date(dateB) ? -1 : 1;
        })
        return result;
    }
}

export type HistoryResult = {
    status: boolean,
    promise: Promise<{ [key: string]: any }>,
    data: AmazonResultTransferObject[]
}

/**
 *
 * @param orderObj
 * @param param
 */
function createOrderOutputObject(orderObj: AmazonOrderDataObj, param: AmazonInvoiceObj): AmazonResultTransferObject {
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