import {AmazonResultTransferObject} from "../../../../types";
import {QualifiedInvoiceLink} from "./QualifiedInvoiceLink";
import {JSX} from "react";

type AmazonResultTransferObjectWrap = { amazonResultTransferObject: AmazonResultTransferObject };
export const QualifiedInvoiceField = (prop: AmazonResultTransferObjectWrap) => {
    let {amazonResultTransferObject} = prop;
    return (
        <>
            <table>
                <tbody>
                {amazonResultTransferObject.invoiceList.map((value, index) => {
                    // 適格請求書なら
                        if (value.isQualifiedInvoice) {
                            return (<tr key={index}>
                                <td><QualifiedInvoiceLink orderNo={amazonResultTransferObject.orderNumber} idx={index}/>
                                </td>
                            </tr>);
                        }
                    }
                )}
                </tbody>
            </table>
        </>
    )
}