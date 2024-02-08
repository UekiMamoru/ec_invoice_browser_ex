import {AmazonResultTransferObject, CombinePDFData} from "../../../../types";
import {HistoryHeader} from "./HistoryHeader";
import {HistoryBody} from "./HistoryBody";
import {CombinePDFModel} from "../../../../../model/CombinePDFModel";
import button from "../../../../../../css/button.module.scss"
import {
    CreateAmazonHistoryDataToCSVDataCreator
} from "../../../../../model/amazon/converter/CreateAmazonHistoryDataToCSVDataCreator";
import {CSVFileExporter} from "../../../../../lib/export/CSVFileExporter";


type HistoryFieldData = {
    data: AmazonResultTransferObject[], createInput: boolean
}
let creator = new CreateAmazonHistoryDataToCSVDataCreator();

export const HistoryField = (prop: HistoryFieldData) => {
    let {data, createInput} = prop;
    const c = new CombinePDFModel();
    const exportCsv = async () => {
        for (let obj of data) {
            creator.convertToAddLine(obj)
        }
        let csvStr = creator.createCSVFormatStr();
        creator.clear();
        new CSVFileExporter().download("amazon-order-result.csv", csvStr)
    }
    return (<>

        {createInput ?
            <div>
            <button className={button.blue} onClick={() => {
                    c.export();
                }}>選択したPDFを1つのPDFにまとめる
                </button>
                <p>※最低{c.MIN_DATA_SIZE}件を選択。最大{c.MAX_DATA_SIZE}件まで選択可能です</p>
            </div> :
            <div style={{padding:".5em 0"}}>
            <button onClick={exportCsv}>CSVダウンロード(β版)</button><span>※文字コードがshift-jisではないため、Excelでは文字化けします。スプレッドシート等でご確認ください</span>
        </div>}
        <table>
            <HistoryHeader createInput={createInput}/>
            <tbody>
            <HistoryBody combinePDFModel={c} createInput={createInput} data={data}/>
            </tbody>
        </table>
    </>)
}