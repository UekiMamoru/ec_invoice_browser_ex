import {useParams} from "react-router-dom";
import {HistoryField} from "./field/HistoryField";
import {AmazonResultTransferObject} from "../../../types";

type HistoryResultData = {
    siteName: string, data: AmazonResultTransferObject[]
}
export const HistoryResult = (prop: HistoryResultData) => {
    let {siteName, data} = prop
    const {id} = useParams();
    return (
        <>
            <h1><span id="siteName">{siteName}</span>の結果</h1>
            <HistoryField createInput={false} data={data}/>
        </>
)
}
