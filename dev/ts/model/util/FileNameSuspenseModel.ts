import {FileFormatStorage} from "../../db/FileFormatStorage";
import { FileNameFormatObj} from "../../react/types";

export class FileNameSuspenseModel {

    private _siteName: string = "";
    private _fileFormatStorage: FileFormatStorage;
    private _lastPromiseMap!: Map<string, FileNameSuspenseResult>;

    constructor() {
        this._fileFormatStorage = new FileFormatStorage();
        this._lastPromiseMap = new Map<string, FileNameSuspenseResult>()
    }

     getFileFormat(str : string) {
        return this.getFormat(str);
    }

    resultCheck(ecResult: FileNameSuspenseResult) {
        if (ecResult.status) {
            return ecResult.data;
        }
        throw ecResult.promise;
    }
    getFormat(key: string): FileNameSuspenseResult {
        let ecPageData = this._lastPromiseMap.get(key);
        if (ecPageData) {
            return ecPageData;
        }
        let promise = this._fileFormatStorage.get();
        ecPageData = {
            status: false, promise
        }
        this._lastPromiseMap.set(key, ecPageData)
        promise.then((data: any) => {
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

    objectConvert(data: any) {
        let fileNameFormatObj: FileNameFormatObj = data;
        return fileNameFormatObj;
    }

    getDefData(){
        return this._fileFormatStorage.getDefaultVal();
    }
}

export type FileNameSuspenseResult = {
    status: boolean,
    promise: Promise<{ [key: string]: any }>,
    data?: FileNameFormatObj
}
