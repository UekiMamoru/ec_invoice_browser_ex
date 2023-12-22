import * as React from "react";
import {SiteHistoryPageTitle} from "../component/page/SiteHistoryPageTitle";

import { createRoot } from 'react-dom/client';
import {SiteHistoryResult} from "../component/page/SiteHistoryResult";
const container = document.getElementById('app');

const App = () => {

    const AMAZON_EC_NAME = "amazon";
    // 表示するサイト名を取得
    let locSearchParam = new URLSearchParams(location.search);
    let ecName = locSearchParam.get("ec")
    if(!ecName){
        alert(`ショップがありません。`);
        window.close()
        return ;
    }

    let name = ecName//AMAZON_EC_NAME;
    let title = "取得済みの注文履歴一覧";
    return (
        <>
            <SiteHistoryPageTitle siteName={name} title={title}/>
            <SiteHistoryResult siteName={name}/>
        </>
    )
};


const root = createRoot(container!);// if you use TypeScript
root.render(<App />);