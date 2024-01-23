import { FileNameFormatObj} from "../../react/types";

export class FineNameFormatModel {

    constructor() {
    }

    async getFormat() {
        let format = await chrome.runtime.sendMessage({type: "get-file-format"});
        return this.objectToFormat(format)
    }

    async update(fileNameFormatObj:FileNameFormatObj){
        await chrome.runtime.sendMessage({type:"set-file-format",data:fileNameFormatObj})
    }

    objectToFormat(obj: any) {
        let fileNameFormat: FileNameFormatObj = obj;
        return fileNameFormat
    }
}