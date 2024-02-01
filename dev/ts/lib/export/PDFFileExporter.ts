import {FileExporter} from "./FileExporter";
import {ExportPDFBinaryFile} from "../../react/types";
import {PDFDownloader} from "../../model/PDFDownloader";

export class PDFFileExporter extends FileExporter {

    constructor() {
        super();
    }

    async export(exportPDFBinaryFile: ExportPDFBinaryFile, prop?: { [p: string]: string }): Promise<boolean> {
        this.downloadPDF(exportPDFBinaryFile)
        return true;
    }



    private downloadPDF(exportPDFBinaryFile: ExportPDFBinaryFile) {
        PDFDownloader.downloadPDF(exportPDFBinaryFile.arrayBuffer, exportPDFBinaryFile.fileName);
    }
}