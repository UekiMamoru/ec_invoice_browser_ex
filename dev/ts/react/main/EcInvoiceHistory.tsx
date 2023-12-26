import * as React from "react";
import {SiteHistoryPageTitle} from "../component/page/SiteHistoryPageTitle";
import {SiteHistoryResult} from "../component/page/SiteHistoryResult";
import {useParams} from "react-router-dom";
import {ReloadRewriter} from "../component/util/ReloadRewriter";

export const  EcInvoiceHistory = () => {

    const AMAZON_EC_NAME = "amazon";
    let { id } = useParams();
    // 表示するサイト名を取得
    // let locSearchParam = new URLSearchParams(location.search);
    let ecName = id;//locSearchParam.get("ec")
    if(!ecName){
        alert(`ショップがありません。`);
        window.close()
        return ;
    }

    let name = ecName//AMAZON_EC_NAME;
    let title = "取得済みの注文履歴一覧";
    return (
        <>
            <ReloadRewriter/>
            {ecName === AMAZON_EC_NAME &&(<SiteHistoryPageTitle siteName={name} title={title}/>)}
            {ecName === AMAZON_EC_NAME &&(<SiteHistoryResult siteName={name}/>)}
            {ecName !== AMAZON_EC_NAME &&<p>{ecName}は登録されていません。</p>}
        </>
    )
};


// const root = createRoot(container!);// if you use TypeScript
// root.render(<App />);