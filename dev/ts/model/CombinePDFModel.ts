import {CombinePDFData} from "../react/types";
import PDFMerger from "pdf-merger-js/browser";
import {PDFBufferData} from "./PDFBufferData";
import {OrderPDFCacheDataStore} from "./OrderPDFCacheDataStore";

export class CombinePDFModel {
    private _selectedDataList: CombinePDFData[] = [];
    private _MAX_DATA_SIZE: number = 5;
    private _MIN_DATA_SIZE: number = 2;

    constructor() {
    }

    get MAX_DATA_SIZE() {
        return this._MAX_DATA_SIZE;
    }

    get MIN_DATA_SIZE(){
        return this._MIN_DATA_SIZE
    }

    add(combinePDFData: CombinePDFData): boolean {
        if (this._selectedDataList.length > this._MAX_DATA_SIZE) {
            alert(`選択は${this._MAX_DATA_SIZE}件までです`)
            return false
        }
        this._selectedDataList.push(combinePDFData);
        return true;
    }

    remove(combinePDFData: CombinePDFData) {
        this._selectedDataList = this._selectedDataList.filter(e => {
            combinePDFData.orderNumber !== e.orderNumber
        });
    }

    async export() {
        //
        if (this._selectedDataList.length < this._MIN_DATA_SIZE || this._selectedDataList.length >= this._MAX_DATA_SIZE) {
            alert("2つ以上,5つ以内で選択してください");
            return;
        }
        const EC_KEY_PREFIX = "ec_";
        const ecName = "amazon";
        let key = `${EC_KEY_PREFIX}${ecName}`;
        let list = [key];
        let manager = new PDFMerger();
        let store = new OrderPDFCacheDataStore();
        let dataList = await store.getAllCacheData(list)
        let keyData = dataList[key];
        console.log(keyData);
        let keys = Object.keys(keyData);
        let checkedList: any = [];
        for (let orderNumber of keys) {
            let data = keyData[orderNumber];
            if (this._selectedDataList.find(data => data.orderNumber === orderNumber)) {
                checkedList.push(data)
            }
        }
        // 1件もデータが無かったらエラー


        let sorted = checkedList.sort((obj1: any, obj2: any) => {
            let dateA = obj1.amazonOrderDataObj.date.replace("年", "/").replaceAll("月", "/").replace("日", "")
            let dateB = obj2.amazonOrderDataObj.date.replace("年", "/").replaceAll("月", "/").replace("日", "")
            return new Date(dateA) > new Date(dateB) ? -1 : 1;
        })

        for (let data of sorted) {

            let pdfStrs = data.pdfStrs;
            let arrayBuff = PDFBufferData.arrayBuffSerializableStringToArrayBuff(pdfStrs[0]);
            await manager.add(arrayBuff);
        }
        // データを日付順にsort
        const mergedPdf = await manager.saveAsBlob();
        const url = URL.createObjectURL(mergedPdf);
        // const iframe = document.createElement("iframe")
        // iframe.width = "100%";
        // iframe.height = "1000px";
        // iframe.src = url;
        // document.body.appendChild(iframe)
        chrome.tabs.create({url, active: true})
    }
}