import {ChildToParentSenderData, DATE_SEPARATOR_FORMAT_TYPE} from "../../../../types";

export const PDFFileNameDateSeparatorField = (prop: ChildToParentSenderData) => {
    let {sender, numberVal} = prop;
    let val = Number(numberVal);
    return (
        <>
            <div style={{paddingLeft: "1.5em"}}>
                <p>区切り</p>
                <div style={{display: "flex", paddingLeft: "1em", gap: "2em"}}>
                    <label><input type="radio"
                                  checked={DATE_SEPARATOR_FORMAT_TYPE.HYPHEN === val}
                                  value={DATE_SEPARATOR_FORMAT_TYPE.HYPHEN}
                                  onChange={() => {
                                      sender(DATE_SEPARATOR_FORMAT_TYPE.HYPHEN);
                                  }}


                    />ハイフン区切り（yyyy-mm-dd）形式</label>

                    <label><input type="radio"
                                  onChange={() => {
                                      sender(DATE_SEPARATOR_FORMAT_TYPE.UNDER_SCORE);
                                  }}
                                  checked={DATE_SEPARATOR_FORMAT_TYPE.UNDER_SCORE === val}
                                  value={DATE_SEPARATOR_FORMAT_TYPE.UNDER_SCORE}
                    />アンダーバー区切り（yyyy_mm_dd）形式</label>

                    <label><input type="radio"
                                  onChange={() => {
                                      sender(DATE_SEPARATOR_FORMAT_TYPE.JP_YYYYMMDD);
                                  }}
                                  checked={DATE_SEPARATOR_FORMAT_TYPE.JP_YYYYMMDD === val}
                                  value={DATE_SEPARATOR_FORMAT_TYPE.JP_YYYYMMDD}
                    />年月日（yyyy年mm月dd日）形式</label>
                </div>
            </div>
        </>
    )
}