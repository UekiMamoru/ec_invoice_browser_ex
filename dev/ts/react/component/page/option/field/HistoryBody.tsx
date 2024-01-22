import {AmazonResultTransferObject} from "../../../../types";
import {HistoryTableRow} from "./HistoryTableRow";
import {CombinePDFModel} from "../../../../../model/CombinePDFModel";

type HistoryFieldData = {
    data: AmazonResultTransferObject[]
    ,combinePDFModel:CombinePDFModel
    ,createInput : boolean
}

export const HistoryBody = (prop: HistoryFieldData) => {
    let {data,combinePDFModel,createInput} = prop;
    return (
        <>
            {data.map((amazonResultTransferObject, idx) => {
                let key = idx+""
                    return <HistoryTableRow amazonResultTransferObject={amazonResultTransferObject}
                                            createInput={createInput}
                                            combinePDFModel={combinePDFModel}
                                            key={idx+""}
                                            idx={idx}/>
                }
            )}
        </>
    )
}