import {ExportPDFBinaryFile} from "../../react/types";

export abstract class FileExporter{
    async export(t:ExportPDFBinaryFile,prop?:{[key:string]:string}):Promise<boolean>{
        return false;
    };

    async flash(){

    }
}