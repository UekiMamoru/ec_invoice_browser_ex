import {AmazonResultTransferObject} from "../../../../types";
import {HistoryTableRow} from "./HistoryTableRow";

type HistoryFieldData = {
    data: AmazonResultTransferObject[]
}

export const HistoryBody = (prop: HistoryFieldData) => {
    let {data} = prop;
    return (
        <>
            {data.map((amazonResultTransferObject, idx) => {
                let key = idx+""
                    return <HistoryTableRow amazonResultTransferObject={amazonResultTransferObject}
                                            key={idx+""}
                                            idx={idx}/>
                }
            )}
        </>
    )
}