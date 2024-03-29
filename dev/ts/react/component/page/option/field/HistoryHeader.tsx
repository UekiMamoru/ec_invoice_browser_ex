type Req = {
    createInput:boolean
}
export const HistoryHeader = (prop:Req) => {
    let {createInput} = prop;
    return(
        <>
            <thead>
            <tr>
                {createInput?<th>選択</th>:""}
                <th>番号</th>
                <th>注文番号</th>
                <th>注文日</th>
                <th>注文合計金額</th>
                <th>注文品</th>
                <th>デジタル</th>
                <th>複数注文</th>
                <th>適格取引</th>
                <th>PDF作成</th>
                <th>適格請求書</th>
                <th>支払明細書</th>
                {/*<th>既に作成済</th>*/}
            </tr>
            </thead>
        </>
    );
}