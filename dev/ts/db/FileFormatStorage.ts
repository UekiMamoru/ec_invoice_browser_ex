import {DATE_FORMAT_TYPE, FileNameFormatObj} from "../react/types";

export class FileFormatStorage {
    private _fileFormat: FileNameFormatObj;
    private _key: string = `fileFormatData`;

    constructor() {
        this._fileFormat = this.getDefaultVal();
    }


    async get() {
        let key = this._key;
        let list = [key];
        let result = await chrome.storage.local.get(list);
        let data = result[key];
        // もしデータがなければデフォルトを利用
        if (!data) {
            data = this._fileFormat;
        }
        this._fileFormat = data;
        return this._fileFormat;
    }


    async update(data: FileNameFormatObj) {
        let key = this._key;
        this._fileFormat.format = data.format;
        await chrome.storage.local.set({[key]: this._fileFormat})
    }

    getDefaultVal() {
        let f: FileNameFormatObj = {
            format: "",
            formats: [],
            default: {viewName: "{{サイト名}}_{{注文年月日}}_{{注文番号}}", name: "default", format: ``},
            option: {
                orderDate: {viewName: "{{注文年月日}}", name: "date", format: `{{__ORDER_DATE__}}`},
                orderNum: {viewName: "{{注文番号}}", name: "number", format: `{{__ORDER_NUM__}}`},
                siteName: {viewName: "{{サイト名}}", name: "site", format: `{{__SITE_NAME__}}`},
            },
            custom: [],
            dateFormat:DATE_FORMAT_TYPE.JP_YYYYMMDD
        }
        f.default.format = `${f.option.siteName.format}_${f.option.orderDate.format}_${f.option.orderNum.format}`;
        return f;
    }
}