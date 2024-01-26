import {Suspense} from "react";
import {HistoryResult, OrderHistoryDataModel} from "../../../../model/OrderHistoryDataModel";
import * as React from "react";
import {HistoryDataStorage} from "../../../../db/HistoryDataStorage";

type EcHistoryLinkParam = { siteName: string }
export const EcHistoryLink = (param: EcHistoryLinkParam) => {
    let {siteName} = param
    return (
        <>
            <Suspense fallback={<Loading/>}>
                <Exporter siteName={siteName}/>
            </Suspense>
        </>
    )
}


const orderHistoryDataModel = new OrderHistoryDataModel();
const Exporter = (siteHistoryResultProp: EcHistoryLinkParam) => {
    let {siteName} = siteHistoryResultProp
    let dataObject = ecResultCheck(geSiteData(siteName))
    console.log(dataObject);
    let entit = Object.entries(dataObject);
    let len = entit.length
    if(len > 0){
        return  (
            <>

                <div>
                    <div style={{padding:".5em 0"}}>
                    <button id="ecHistory" className={"btn"} onClick={() => {
                        let url = chrome.runtime.getURL(`option/index.html?target=history&ec=${siteName}`);
                        chrome.tabs.create({url})
                    }
                    }>amazonの取得履歴ページを開く
                    </button>
                    </div>
                    <button onClick={() => {
                        if (confirm("情報を削除すると戻せません。再取得する必要があります。よろしいでしょうか")) {
                            // 削除
                            let st =
                                new HistoryDataStorage()
                            st.clearAllEcOrder("amazon")
                                .then(() => {
                                    alert("完了しました。");
                                    // 閉じる
                                    window.close();
                                })
                        }
                    }}>amazonの取得情報を削除する
                    </button>
                </div>

            </>

        )
    }else {
        return (<></>)
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