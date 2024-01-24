import {ChildToParentSenderData, DATE_ZERO_PADDING_FORMAT_TYPE} from "../../../../types";


export const PDFFileNameDateZeroPaddingField = (childToParentSenderData: ChildToParentSenderData) => {
    let {sender, numberVal} = childToParentSenderData;
    return (
        <>
            <p>
               ・<label>
                    <input type="checkbox"
                              checked={numberVal === DATE_ZERO_PADDING_FORMAT_TYPE.PADDING}
                              onChange={(ev) => {
                                  // 変更を通知する
                                    sender(
                                        ev.currentTarget.checked?
                                            DATE_ZERO_PADDING_FORMAT_TYPE.PADDING:
                                            DATE_ZERO_PADDING_FORMAT_TYPE.NO_PADDING
                                    );
                              }}/>
                日付データの月と日が1桁の場合、10の位をゼロ埋めする
                </label>
            </p>
        </>
    );
}