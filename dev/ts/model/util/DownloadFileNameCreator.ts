import {FileNameFormat} from "./FileNameFormat";
import {
    AmazonOrderDataObj,
    DATE_FORMAT_TYPE,
    FileNameExportData,
    FileNameFormatObj,
    FileNameTypeObj
} from "../../react/types";

export class DownloadFileNameCreator {
    private _fileNameFormat: FileNameFormat;
    private _siteName: string = "";

    constructor(_siteName: string, _fileNameFormat?: FileNameFormat) {
        this._siteName = _siteName
        if (!_fileNameFormat) {
            _fileNameFormat = new FileNameFormat();
        }
        this._fileNameFormat = _fileNameFormat
        this._fileNameFormat.getFormat();
    }

    convert(format: string, fileNameFormatObj: FileNameFormatObj, amazonOrderDataObj: FileNameExportData) {
        let formatStr = this.viewNameToFormatPattern(format, fileNameFormatObj);
        formatStr = this.convertFileNameTypeObjToStr(fileNameFormatObj.option.siteName, formatStr, this._siteName)
        formatStr = this.convertFileNameTypeObjToStr(fileNameFormatObj.option.orderDate, formatStr, this.convertDateFormat(
            amazonOrderDataObj.date, fileNameFormatObj.dateFormat)
        )
        formatStr = this.convertFileNameTypeObjToStr(fileNameFormatObj.option.orderNum, formatStr, amazonOrderDataObj.orderNumber)
        return formatStr;
    }

    async createFileName(amazonOrderDataObj: AmazonOrderDataObj, index?: number | string) {
        // ファイルフォーマットがあるか
        let fileNameFormatObj = await this._fileNameFormat.getFormat();
        let format = fileNameFormatObj.format;
        if (!format) {
            format = fileNameFormatObj.default.format;
        }
        let fileNameExportData: FileNameExportData = {
            orderNumber: amazonOrderDataObj.no,
            date: amazonOrderDataObj.date,
            siteName: this._siteName
        }
        let formatStr = this.convert(format,fileNameFormatObj,fileNameExportData)
        if (index !== undefined && index !== "") {
            formatStr += index
        }
        return formatStr;
    }

    convertDateFormat(date: string, type: number) {
        let str = date;
        // yyyy年mm月dd日形式になっているので、それをリプレース
        switch (type) {
            case DATE_FORMAT_TYPE.HYPHEN:
                return date.replaceAll(/年|月/ig, "-").replaceAll("日","");
            case DATE_FORMAT_TYPE.SLASH:
                return date.replaceAll(/年|月/ig, "/").replaceAll("日","");
        }

        return str;
    }

    viewNameToFormatPattern(activeFormatViewNameString: string, fileNameFormatObj: FileNameFormatObj) {
        let option = fileNameFormatObj.option;
        let result = activeFormatViewNameString;
        Object.values(option).forEach(fileNameTypeObj => {
            let viewName = fileNameTypeObj.viewName;
            let format = fileNameTypeObj.format;
            result = result.replaceAll(viewName, format);
        })
        return result;
    }


    private convertFileNameTypeObjToStr(fileNameTypeObj: FileNameTypeObj, format: string, date: string) {
        return format.replaceAll(fileNameTypeObj.format, date);
    }
}