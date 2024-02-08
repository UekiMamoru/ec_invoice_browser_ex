export class CSVDataCreator {
    private _csvArr :string[][]=[]
    private _headerDataArr : string[]=[];

    constructor() {
    }

    set headerDataArr(_:string[]){
        this._headerDataArr = _;
    }
    addLine(strArray:string[]){
        // 全て " で囲む
        this._csvArr.push(strArray.map(str=>`"${str.replaceAll('"',"")}"`));
    }

    clear(){
        this._csvArr =[]
    }
    createCSVFormatStr(){
        let csvStr = "";
        if(this._headerDataArr.length){
            csvStr+=this._headerDataArr.join(",");
            csvStr+="\r\n";
        }
        this._csvArr.forEach(arr=>{
            csvStr+=arr.join(",");
            csvStr+="\r\n";
        })
        return csvStr;
    }
}