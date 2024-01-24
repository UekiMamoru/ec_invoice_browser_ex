import * as React from "react";
import {SiteHistoryPageTitle} from "../component/page/SiteHistoryPageTitle";
import {SiteHistoryResult} from "../component/page/SiteHistoryResult";
import {useParams} from "react-router-dom";
import {ReloadRewriter} from "../component/util/ReloadRewriter";
import {PDFFileNameSetting} from "../component/page/option/setting/PDFFileNameSetting";

export const  EcInvoiceSetting = () => {
    let title = "設定";
    return (
        <>
            <ReloadRewriter/>
            <h1>{title}</h1>
            <h2>{"PDFファイル名設定"}</h2>
            <PDFFileNameSetting/>

        </>
    )
};


// const root = createRoot(container!);// if you use TypeScript
// root.render(<App />);