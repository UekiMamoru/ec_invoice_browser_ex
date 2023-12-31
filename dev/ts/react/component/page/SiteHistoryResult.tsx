import {HistoryResult, OrderHistoryDataModel} from "../../../model/OrderHistoryDataModel";
import {Suspense, useEffect, useState} from "react";
import * as React from "react";

type SiteHistoryResultProp = { siteName: string }
let cache = {}

export const SiteHistoryResult = (prop: SiteHistoryResultProp) => {
    let {siteName} = prop;
    return (
        <Suspense fallback={<Loading/>}>
            <Exporter siteName={siteName}/>
        </Suspense>
    )
}
const orderHistoryDataModel = new OrderHistoryDataModel();
const Exporter = (siteHistoryResultProp: SiteHistoryResultProp) => {
    let {siteName} = siteHistoryResultProp
    let dataObject = ecResultCheck(geSiteData(siteName))
    console.log(dataObject);
    let entit = Object.entries(dataObject);
    let len = entit.length;
    return (
        <>
            <p>結果</p>
            {len > 0 ? (<div>{
                entit.map(data =>
                    <p key={data[0]}>{data[0]}</p>
                )
            }</div>) : (<p>履歴はありませんでした。</p>)}
        </>
    )
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