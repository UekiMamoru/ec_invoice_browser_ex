import {FileExporter} from "./FileExporter";
import JSZip from "jszip";
import {ExportPDFBinaryFile} from "../../react/types";
import {PDFDownloader} from "../../model/PDFDownloader";
import {types} from "sass";
import Boolean = types.Boolean;

export class ZipFileExporter extends FileExporter {
    private _jsZip: JSZip;
    private _lastVal: string = "";
    private _zipDataList: ExportPDFBinaryFile[];

    constructor() {
        super();
        this._jsZip = this.getZipLibInstance();
        this._zipDataList = [];
    }

    async export(exportPDFBinaryFile: ExportPDFBinaryFile, prop?: { [p: string]: string }): Promise<boolean> {
        if (!prop) {
            throw new Error("error");
        }
        let ym = prop.val;
        if (this._lastVal && ym !== this._lastVal) {
            this.download();
        }
        this._zipDataList.push(exportPDFBinaryFile)
        this._lastVal = ym;
        return true;
    }

    async download() {
        // ZIPダウンロード
        this._zipDataList.forEach(zipData => {
            this._jsZip.file(zipData.fileName + ".pdf", zipData.arrayBuffer);
        })
        this.downloadZip(this._lastVal);
        // リセット
        this._jsZip = new JSZip();
        this._zipDataList = []
    }

    async flash(): Promise<void> {
        // 最終的に残ってたら、ダウンロード
        if (this._zipDataList.length) {
            this.download()
        }
    }

    private getZipLibInstance() {
        return new JSZip();
    }


    private downloadZip(ym: string) {
        let zip = this._jsZip;
        PDFDownloader.downloadZipPDF(zip, ym)
    }
}