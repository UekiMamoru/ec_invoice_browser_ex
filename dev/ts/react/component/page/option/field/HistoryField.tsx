import {AmazonResultTransferObject} from "../../../../types";
import {HistoryHeader} from "./HistoryHeader";
import {HistoryBody} from "./HistoryBody";

type HistoryFieldData = {
    data: AmazonResultTransferObject[]
}

export const HistoryField = (prop: HistoryFieldData) => {
    let {data} = prop;
    return (<>
        <table>
        <HistoryHeader/>
            <tbody>
               <HistoryBody data={data}/>
            </tbody>
        </table>
    </>)
}