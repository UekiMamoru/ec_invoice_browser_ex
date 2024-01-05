import button from "../../../../../css/amazon/style.modules.css"

export const CreateInvoice = (prop: {
    callback: Function,
    getState: Function
}) => {
    let {callback, getState} = prop;

    return (


        <button className={button.button} onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            callback(true);
            createInvoiceData();
            setTimeout(() => {
                callback(false);
            }, 1000)
        }} disabled={getState()}>
            ページに表示された注文情報のインボイスデータを作る
        </button>

    )
}

function createInvoiceData() {
}