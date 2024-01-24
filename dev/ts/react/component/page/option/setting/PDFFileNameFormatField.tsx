import {FileNameExportData, FileNameFormatObj} from "../../../../types";

type PDFFileNameFormatFieldData = {
    fileNameExportData: FileNameExportData,
    formatText: string,
    updateFormatText: Function
    fileNameFormatObj: FileNameFormatObj

}
export const PDFFileNameFormatField = (prop: PDFFileNameFormatFieldData) => {
    let {fileNameExportData, formatText, updateFormatText, fileNameFormatObj} = prop;
    return (
        <>

            <div>
                <p>表示サンプル用データ</p>
                <table>
                    <thead>
                    <tr>
                        <th></th>
                        <th>サイト名</th>
                        <th>注文日</th>
                        <th>注文番号</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th>サンプルデータ</th>
                        <td>{fileNameExportData.siteName}</td>
                        <td>{fileNameExportData.date}</td>
                        <td>{fileNameExportData.orderNumber}</td>
                    </tr>
                    <tr>
                        <th>フォーマットパターン</th>
                        <td>{fileNameFormatObj.option.siteName.viewName}</td>
                        <td>{fileNameFormatObj.option.orderDate.viewName}</td>
                        <td>{fileNameFormatObj.option.orderNum.viewName}</td>
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
                               updateFormatText(value);
                           }
                       }
                       onKeyUp={
                           (ev) => {
                               // 入力された情報でどのように表示されるかを更新してsetFormattedFileNameへ
                               let value = ev.currentTarget.value;
                               updateFormatText(value);
                           }
                       }
                />

            </div>

        </>
    )
}