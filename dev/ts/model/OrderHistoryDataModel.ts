import {HistoryDataStorage} from "../db/HistoryDataStorage";

export class OrderHistoryDataModel{
    private _siteName :string = "";
    private _historyDataStorage:HistoryDataStorage;
    private _lastPromiseMap!:Map<string,HistoryResult>;
    constructor() {
        this._historyDataStorage = new HistoryDataStorage();
        this._lastPromiseMap = new Map<string,HistoryResult>()
    }
    historyData(ecName:string):HistoryResult{
        let ecPageData =this._lastPromiseMap.get(ecName);
        if(ecPageData){
            return ecPageData;
        }
        let promise = this._historyDataStorage.getEcAll(ecName);
        ecPageData = {
            status:false,promise,data:{}
        }
        this._lastPromiseMap.set(ecName,ecPageData)
        promise.then((data:{[key:string]:any})=>{
            if(ecPageData){
                ecPageData.data = data;
                ecPageData.status = true;
            }
        }).catch(e=>{
            if(ecPageData){
                ecPageData.status = false;
            }
        })
        return ecPageData
    }
}
export type HistoryResult = {status:boolean,promise:Promise<{[key:string]:any}>,data:{[key:string]:any}}