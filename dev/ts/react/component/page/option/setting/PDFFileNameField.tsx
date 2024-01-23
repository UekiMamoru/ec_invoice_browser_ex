import {useState} from "react";
import {DATE_FORMAT_TYPE, FileNameExportData, FileNameFormatObj, FileNameTypeObj} from "../../../../types";
import {DownloadFileNameCreator} from "../../../../../model/util/DownloadFileNameCreator";

type FileNameFormatObjTransfer = {
    fileNameFormatObj: FileNameFormatObj
}
export const PDFFileNameField = (prop: FileNameFormatObjTransfer) => {
    let {fileNameFormatObj} = prop
    let [formatText, setFormatText] = useState(getFormat(fileNameFormatObj));
    let sampleFileData: FileNameExportData = {
        orderNumber: "123-123456-78910",
        date: "2023年4月5日",
        siteName: "amazon"
    }
    let [formattedFileName, setFormattedFileName] = useState(formattedText(
        fileNameFormatObj, formatText, sampleFileData
    ));
    return (
        <>
            <div style={{width: "100%"}}>
                <div>
                    <p>表示サンプル用データ</p>
                    <table>
                        <thead>
                        <tr>
                            <th>サイト名</th>
                            <th>注文日</th>
                            <th>注文番号</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{sampleFileData.siteName}</td>
                            <td>{sampleFileData.date}</td>
                            <td>{sampleFileData.orderNumber}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
                <p>・フォーマットを入力してください</p>
                <div style={{padding: ".5em 0"}}>
                    <input type="text"
                           style={{width: "100%", padding: ".3em", fontSize: "1.3em", backgroundColor: "white"}}
                           value={formatText}
                           onChange={
                               (ev) => {
                                   // 入力された情報でどのように表示されるかを更新してsetFormattedFileNameへ
                                   let value = ev.currentTarget.value;
                                   setFormatText(value);
                               }
                           }
                           onKeyUp={
                               (ev) => {
                                   // 入力された情報でどのように表示されるかを更新してsetFormattedFileNameへ
                                   let value = ev.currentTarget.value;
                                   setFormatText(value);
                                   let converted = formattedText(fileNameFormatObj, value, sampleFileData);
                                   setFormattedFileName(converted);
                               }
                           }
                    />

                </div>

                <p style={{padding: ".5em", width: "100%", maxInlineSize: "initial"}}>ファイル名は「<span
                    style={{fontWeight: "bold"}}>{formattedFileName}.pdf</span>」で保存されます。</p>

                <div>
                    <p>・日付フォーマットを変える</p>
                    <div style={{paddingLeft: "1.5em"}}>

                        <p>日付区切り</p>
                        <div style={{display: "flex", paddingLeft: "1em", gap: "2em"}}>
                            <a onClick={() => {
                                fileNameFormatObj.dateFormat = DATE_FORMAT_TYPE.HYPHEN;
                                let converted = formattedText(fileNameFormatObj, formatText, sampleFileData);
                                setFormattedFileName(converted);
                            }}>yyyy-mm-dd形式
                            </a>
                            <a onClick={() => {
                                fileNameFormatObj.dateFormat = DATE_FORMAT_TYPE.SLASH;
                                let converted = formattedText(fileNameFormatObj, formatText, sampleFileData);
                                setFormattedFileName(converted);
                            }}>yyyy/mm/dd形式
                            </a>
                            <a onClick={() => {
                                fileNameFormatObj.dateFormat = DATE_FORMAT_TYPE.JP_YYYYMMDD;
                                let converted = formattedText(fileNameFormatObj, formatText, sampleFileData);
                                setFormattedFileName(converted);
                            }}>yyyy年mm月dd日形式
                            </a>
                        </div>
                    </div>
                </div>
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
