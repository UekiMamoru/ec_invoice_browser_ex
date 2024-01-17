import * as React from "react";
import {createRoot} from "react-dom/client";
import {HistoryResult} from "../component/page/option/HistoryResult";
import {AmazonResultTransferObject} from "../types";

const container = document.getElementById('app');
// chrome.runtime.onMessage.addListener((message, sender, callback) => {
//     if (message.type === "invoice-result") {
//         let siteName = message.site
//         // document.querySelector("#resultField").innerHTML = createTable(message.data);
//         let data = convert(message.data);
//         console.log(data);
//         const App = () => {
//             return (
//                 <>
//                     <HistoryResult data={data} siteName={siteName}/>
//                 </>)
//         };
//         const root = createRoot(container!);// if you use TypeScript
//         root.render(<App/>);
//     }
// })
chrome.runtime.sendMessage({type:"get-last-data"}).then(message=>{

    let siteName = message.site
// document.querySelector("#resultField").innerHTML = createTable(message.data);
    let data = convert(message.data);
    console.log(data);
    const App = () => {
        return (
            <>
                <HistoryResult data={data} siteName={siteName}/>
            </>)
    };
    const root = createRoot(container!);// if you use TypeScript
    root.render(<App/>);
})
function convert(object: any[]) {
    let list : AmazonResultTransferObject[] = []
    for(const data of object){

        let amazonResultTransferObject: AmazonResultTransferObject = data;
        list.push(amazonResultTransferObject)
    }
    return list;
}