import * as React from "react";
import {SiteHistoryTitle} from "./SiteHistoryTitle";
type SiteHistoryParamProp = {siteName:string,title:string}
/**
 *
 * @param prop
 * @constructor
 */
export const SiteHistoryPageTitle = (prop : SiteHistoryParamProp) => {
    let {siteName , title} = prop;
    return (
        <>
            <div>
                <h1><span id="siteName">{siteName}</span>の取得履歴</h1>
                <SiteHistoryTitle title={title}/>
            </div>
        </>
    )
};