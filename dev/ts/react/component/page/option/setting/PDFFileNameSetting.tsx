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
function PDFFileNameFieldWrap(){

    let data = fileNameSuspenseModel.resultCheck(fileNameSuspenseModel.getFileFormat("format"));//ecResultCheck(getFileFormat())
    if(!data){
        data = getDefData()
    }

    return (
        <>
            <PDFFileNameField fileNameFormatObj={data}/>
        </>

    );
}

function getDefData(){
    return fileNameSuspenseModel.getDefData();
}