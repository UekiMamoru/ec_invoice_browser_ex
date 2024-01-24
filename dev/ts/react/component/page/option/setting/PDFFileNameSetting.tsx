import {Suspense} from "react";
import {PDFFileNameField} from "./PDFFileNameField";
import {FileNameSuspenseModel} from "../../../../../model/util/FileNameSuspenseModel";
import {FileNameFormatObj} from "../../../../types";

const fileNameSuspenseModel = new FileNameSuspenseModel();


export const PDFFileNameSetting = () => {
    // 現在のフォーマット設定データをロードして渡す
    return (
        <>
            <Suspense fallback={"ロード中"}>
                <PDFFileNameFieldWrap/>
            </Suspense>
        </>

    )
}

function PDFFileNameFieldWrap() {
    let key = "format"
    let data = fileNameSuspenseModel.resultCheck(fileNameSuspenseModel.getFileFormat(key));
    if (!data) {
        data = getDefData()
    }

    let updateFileNameObj = (fileNameFormatObj: FileNameFormatObj) => {
        fileNameSuspenseModel.updateFormat(key, fileNameFormatObj)
    }

    return (
        <>
            <PDFFileNameField fileNameFormatObj={data} updateFileNameObj={updateFileNameObj}/>
        </>

    );
}

function getDefData() {
    return fileNameSuspenseModel.getDefData();
}