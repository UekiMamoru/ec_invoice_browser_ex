import {AmazonResultTransferObject} from "../../../../types";
import {HistoryTableRow} from "./HistoryTableRow";
import {CombinePDFModel} from "../../../../../model/CombinePDFModel";

type HistoryFieldData = {
    data: AmazonResultTransferObject[]
    ,combinePDFModel:CombinePDFModel
}

export const HistoryBody = (prop: HistoryFieldData) => {
    let {data,combinePDFModel} = prop;
    return (
        <>
            {data.map((amazonResultTransferObject, idx) => {
                let key = idx+""
                    return <HistoryTableRow amazonResultTransferObject={amazonResultTransferObject}
                                            combinePDFModel={combinePDFModel}
                                            key={idx+""}
                                            idx={idx}/>
                }
            )}
        </>
    )
}