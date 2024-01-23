import {FineNameFormatModel} from "./FineNameFormatModel";
import {FileNameFormatObj} from "../../react/types";

export class FileNameFormat {
    private _fileNameFormatModel: FineNameFormatModel;
    private _format!:FileNameFormatObj;

    constructor(_fileNameFormatModel?: FineNameFormatModel) {
        if (!_fileNameFormatModel) {
            _fileNameFormatModel = new FineNameFormatModel();
        }
        this._fileNameFormatModel = _fileNameFormatModel;
    }

    set fileNameFormatModel(_: FineNameFormatModel) {
        this._fileNameFormatModel = _;
    }

    async getFormat() {
        let format = await this._fileNameFormatModel.getFormat();
        this._format = format;
        return format;
    }

    async updateFormat(formatStr : string){
        if(!this._format)await this.getFormat();
        this._format.format = formatStr;
        this._fileNameFormatModel.update(this._format);

    }
}