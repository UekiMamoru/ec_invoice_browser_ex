import {InvoiceControlFieldHeader} from "./InvoiceControlFieldHeader";
import {InvoiceControlFieldBody} from "./InvoiceControlFieldBody";

export const AmazonHistoryField = () => {
    return (
        <>
        <div style={{border:"solid 1px #ccc"}}>
            <InvoiceControlFieldHeader/>
            <InvoiceControlFieldBody/>
        </div>
        </>
    )
}