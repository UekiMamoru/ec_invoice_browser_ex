
export class CSVFileExporter {
    private _isBindBom:boolean = false;

    download(fileName:string,exportCsvFormatStr:string,type:string="text/csv"){

        const downLoadLink = document.createElement('a');
        let name = fileName;
        // if (insertTimestampToFilename) {
        //     const nameArray = name.split('.');
        //     const timestamp = new Date().toLocaleString().replace(/[/ :]/g, '_');
        //     nameArray[0] = `${nameArray[0]}_${timestamp}`;
        //     name = nameArray.join('.');
        // }
        let blob :Blob;
        if(this._isBindBom){

            const bom = new Uint8Array([0xef, 0xbb, 0xbf])
            blob = new Blob([bom,exportCsvFormatStr], { type });
        }else{
            blob = new Blob([exportCsvFormatStr], { type });
        }

        downLoadLink.download = name;
        downLoadLink.href = URL.createObjectURL(blob);
        // downLoadLink.dataset.downloadurl = [type, downLoadLink.download, downLoadLink.href].join(':');
        downLoadLink.click();
        URL.revokeObjectURL(downLoadLink.href);

    }
}