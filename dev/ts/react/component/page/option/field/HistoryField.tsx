import {AmazonResultTransferObject, CombinePDFData} from "../../../../types";
import {HistoryHeader} from "./HistoryHeader";
import {HistoryBody} from "./HistoryBody";
import {CombinePDFModel} from "../../../../../model/CombinePDFModel";
import button from "../../../../../../css/button.module.scss"


type HistoryFieldData = {
    data: AmazonResultTransferObject[]
}

export const HistoryField = (prop: HistoryFieldData) => {
    let {data} = prop;
    const c = new CombinePDFModel();

    return (<>
        <div>
            <button className={button.blue} onClick={() => {
                c.export();
            }}>選択したPDFを1つのPDFにまとめる
            </button>
            <p>※最低{c.MIN_DATA_SIZE}件を選択。最大{c.MAX_DATA_SIZE}件まで選択可能です</p>
        </div>
        <table>
            <HistoryHeader/>
            <tbody>
            <HistoryBody combinePDFModel={c} data={data}/>
            </tbody>
        </table>
    </>)
}