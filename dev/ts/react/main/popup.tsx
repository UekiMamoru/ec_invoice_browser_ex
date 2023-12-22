import * as React from "react";
import {SiteHistoryPageTitle} from "../component/page/SiteHistoryPageTitle";

import { createRoot } from 'react-dom/client';
import {SiteHistoryResult} from "../component/page/SiteHistoryResult";
import {EcHistoryLink} from "../component/page/popup/EcHistoryLink";
const container = document.getElementById('app');

const App = () => {
    let siteName = "amazon"
    return (
        <>
            <button><a href="https://www.amazon.co.jp/gp/your-account/order-history" target="_blank" >Amazonの注文履歴を開く</a></button>
            <EcHistoryLink siteName={siteName}/>
        </>
    )
};


const root = createRoot(container!);// if you use TypeScript
root.render(<App />);