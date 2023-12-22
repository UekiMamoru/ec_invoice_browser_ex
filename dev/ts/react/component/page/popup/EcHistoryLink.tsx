import {Suspense} from "react";
import {HistoryResult, OrderHistoryDataModel} from "../../../../model/OrderHistoryDataModel";
import * as React from "react";
type EcHistoryLinkParam = {siteName:string}
export const EcHistoryLink = (param:EcHistoryLinkParam)=>{
    let {siteName} = param
    return <Suspense fallback={ "now loading..." }>
        <Exporter siteName={siteName}/>
    </Suspense>;
}


const orderHistoryDataModel = new OrderHistoryDataModel();
const Exporter = (siteHistoryResultProp: EcHistoryLinkParam) => {
    let {siteName} = siteHistoryResultProp
    let dataObject = ecResultCheck(geSiteData(siteName))
    console.log(dataObject);
    let entit = Object.entries(dataObject);
    if(entit.length){

        return (
            <div><button id="ecHistory" onClick={()=>{
                    let url = chrome.runtime.getURL(`option/ec-invoice-history.html?ec=${siteName}`);
                    chrome.tabs.create({url})
                }
            }><a >amazonの取得履歴ページを開く</a></button></div>
        )
    }else{
        return (
            <span></span>
        )
    }
}
function ecResultCheck(ecResult: HistoryResult) {
    if (ecResult.status) {
        return ecResult.data;
    }
    throw ecResult.promise;
}

function geSiteData(siteName: string): HistoryResult {
    return orderHistoryDataModel.historyData(siteName);
}

function Loading() {
    return <h2>🌀 Loading...</h2>;
}