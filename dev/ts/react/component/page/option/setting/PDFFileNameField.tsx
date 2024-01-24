import {useEffect, useState} from "react";
import {DATE_SEPARATOR_FORMAT_TYPE, FileNameExportData, FileNameFormatObj, FileNameTypeObj} from "../../../../types";
import {DownloadFileNameCreator} from "../../../../../model/util/DownloadFileNameCreator";
import {PDFFileNameDateSettingField} from "./PDFFileNameDateSettingField";
import {PDFFileNameFormatField} from "./PDFFileNameFormatField";

type FileNameFormatObjTransfer = {
    fileNameFormatObj: FileNameFormatObj
    updateFileNameObj: Function
}
export const PDFFileNameField = (prop: FileNameFormatObjTransfer) => {
    let {fileNameFormatObj, updateFileNameObj} = prop
    let [formatText, setFormatText] = useState(getFormat(fileNameFormatObj));
    let [dateSeparator, setDateSeparator] = useState(fileNameFormatObj.dateSeparator);
    let [zeroPaddingType, setZeroPaddingType] = useState(fileNameFormatObj.dateZeroPadding);
    useEffect(() => {
        fileNameFormatObj.dateSeparator = dateSeparator;
        updateFileNameObj(fileNameFormatObj)
        updateExportText();
    }, [dateSeparator]);
    useEffect(() => {
        fileNameFormatObj.dateZeroPadding = zeroPaddingType;
        updateFileNameObj(fileNameFormatObj)
        updateExportText();
    }, [zeroPaddingType])
    useEffect(() => {
        updateExportText()
    }, [formatText]);

    let updateExportText = () => {
        let converted = formattedText(fileNameFormatObj, formatText, fileNameExportData);
        setFormattedFileName(converted);
    }

    let fileNameExportData: FileNameExportData = {
        orderNumber: "123-123456-78910",
        date: "2023年4月5日",
        siteName: "amazon"
    }
    let [formattedFileName, setFormattedFileName] = useState(formattedText(
        fileNameFormatObj, formatText, fileNameExportData
    ));
    return (
        <>
            <div style={{width: "100%"}}>

                <PDFFileNameFormatField
                    fileNameFormatObj={ fileNameFormatObj}
                    fileNameExportData={fileNameExportData}
                    formatText={formatText}
                    updateFormatText={
                        (str: string) => {
                            setFormatText(str);
                        }
                    }/>
                <p style={{padding: ".5em", width: "100%", maxInlineSize: "initial"}}>ファイル名は「<span
                    style={{fontWeight: "bold"}}>{formattedFileName}.pdf</span>」で保存されます。</p>
                <PDFFileNameDateSettingField
                    dateSeparatorUpdate={(numberVal: number) => {
                        setDateSeparator(numberVal);
                    }}
                    dateZeroPaddingUpdate={(numberVal: number) => {
                        setZeroPaddingType(numberVal);
                    }}
                    activeSeparatorType={dateSeparator}
                    zeroPaddingType={zeroPaddingType}
                />
            </div>
        </>
    );

}

function getFormat(fileNameFormatObj: FileNameFormatObj) {
    if (fileNameFormatObj.format) {
        return fileNameFormatObj.format;
    }
    return fileNameFormatObj.default.viewName;
}

function formattedText(format: FileNameFormatObj, formatStr: string, sampleFileData: FileNameExportData) {
    let downloadFileNameCreator = new DownloadFileNameCreator(sampleFileData.siteName)
    return downloadFileNameCreator.convert(
        formatStr, format, sampleFileData
    )
}
