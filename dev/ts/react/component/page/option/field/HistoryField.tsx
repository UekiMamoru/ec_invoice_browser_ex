import {AmazonResultTransferObject, CombinePDFData} from "../../../../types";
import {HistoryHeader} from "./HistoryHeader";
import {HistoryBody} from "./HistoryBody";
import {CombinePDFModel} from "../../../../../model/CombinePDFModel";
import button from "../../../../../../css/button.module.scss"


type HistoryFieldData = {
    data: AmazonResultTransferObject[],createInput:boolean
}

export const HistoryField = (prop: HistoryFieldData) => {
    let {data,createInput} = prop;
    const c = new CombinePDFModel();

    return (<>
        {createInput?
        <div>
            <button className={button.blue} onClick={() => {
                c.export();
            }}>選択したPDFを1つのPDFにまとめる
            </button>
            <p>※最低{c.MIN_DATA_SIZE}件を選択。最大{c.MAX_DATA_SIZE}件まで選択可能です</p>
        </div>:<span></span>}
        <table>
            <HistoryHeader createInput={createInput}/>
            <tbody>
            <HistoryBody combinePDFModel={c} createInput={createInput} data={data}/>
            </tbody>
        </table>
    </>)
}