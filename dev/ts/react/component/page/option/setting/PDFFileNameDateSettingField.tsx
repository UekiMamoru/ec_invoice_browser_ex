import {PDFFileNameDateZeroPaddingField} from "./PDFFileNameDateZeroPaddingField";
import {PDFFileNameDateSeparatorField} from "./PDFFileNameDateSeparatorField";

type PDFFileNameDateSettingData = {
    dateSeparatorUpdate: Function, activeSeparatorType: number
    dateZeroPaddingUpdate: Function, zeroPaddingType: number
}

export const PDFFileNameDateSettingField = (prop: PDFFileNameDateSettingData) => {
    let {dateSeparatorUpdate, activeSeparatorType, zeroPaddingType,dateZeroPaddingUpdate} = prop
    return (
        <>
            <p>・日付フォーマットを変える</p>
            <PDFFileNameDateSeparatorField sender={dateSeparatorUpdate} numberVal={activeSeparatorType}/>
            <PDFFileNameDateZeroPaddingField sender={dateZeroPaddingUpdate} numberVal={zeroPaddingType}/>
        </>
    )
}