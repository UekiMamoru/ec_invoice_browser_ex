import {PDFBufferData} from "../../../../../model/PDFBufferData";
import {PDFDownloader} from "../../../../../model/PDFDownloader";
import PDFMerger from "pdf-merger-js/browser";
import {SetStateAction, useState} from "react";
import {OrderPDFCacheDataStore} from "../../../../../model/OrderPDFCacheDataStore";
import {AmazonInvoiceDataParamObj} from "../../../../types";

type OrderType = { orderNo: string, idx: number, amazonInvoiceDataParamObj: AmazonInvoiceDataParamObj }
export const QualifiedInvoiceLink = (prop: OrderType) => {

    let {orderNo, idx, amazonInvoiceDataParamObj} = prop;
    let [iframeSrc, setIframeSrc] = useState("");
    let [divLeft, setDivLeft] = useState("0px");
    let [divTop, setDivTop] = useState("0px");
    let [hideState, setHideState] = useState("none");
    let timeObj = setTimeout(() => {
    }, 1);
    return (
        <>
            <a onClick={
                () => download(orderNo, idx)
            }
               onMouseEnter={(event) => {
                   // summaryOverlay(event, orderNo, idx,(url:string)=>{
                   //     if(!iframeSrc)setIframeSrc(url)
                   // })
                   // let rect = event.currentTarget.getBoundingClientRect();
                   // setDivLeft(`${rect.x}px`);
                   // setDivTop(`${rect.y}px`);
                   // setHideState("block");
               }}
            >適格請求書DL</a>
            <p style={{fontSize: ".9em"}}>{amazonInvoiceDataParamObj.invoiceId ?
                <a target="_blank" href={createURL(amazonInvoiceDataParamObj.invoiceId)}>{amazonInvoiceDataParamObj.invoiceId}</a> : "登録番号がありません！"}
            </p>
            {/*<div*/}
            {/*    onMouseLeave={()=>{*/}
            {/*    setHideState("none");*/}
            {/*}} style={{*/}
            {/*    zIndex:"100",*/}
            {/*    display:hideState,*/}
            {/*    top:divTop,*/}
            {/*    left:divLeft,*/}
            {/*    position:"fixed",*/}
            {/*    transform : `translate(25%,-50%)`,*/}
            {/*    background : "white",*/}
            {/*    padding:"1em",*/}
            {/*    boxShadow:"2px 2px 2px #ccc",*/}
            {/*    borderRadius:"5px",*/}
            {/*    width:"30vw",*/}
            {/*    height:"30vh"*/}
            {/*}}>*/}
            {/*    <iframe style={{width:"100%",height:"100%"}} src={iframeSrc}></iframe>*/}
            {/*</div>*/}
        </>
    )
}

function createURL(str:string){
    let mat = str.replaceAll(/[^0-9]/ig,"")
    return `https://www.invoice-kohyo.nta.go.jp/regno-search/detail?selRegNo=${mat}`
}

async function download(orderNumber: string, dataIdx: number) {
    let [data, fileName] = await getTmpVal(orderNumber);
    let pdfArrayBuffer;
    data.pdfStrs.forEach((pdfStr: string, idx: number) => {
        if (idx === dataIdx) {
            let exFileName = `tmp_${fileName}${idx > 1 ? idx - 1 : ""}`;
            pdfArrayBuffer = (PDFBufferData.arrayBuffSerializableStringToArrayBuff(pdfStr));
            if (pdfArrayBuffer) {
                PDFDownloader.downloadPDF(pdfArrayBuffer, exFileName);
            }
            pdfArrayBuffer = "";
        }
    });
}

async function summaryOverlay(ev: React.MouseEvent<HTMLAnchorElement>, orderNumber: string, dataIdx: number, setSrc: Function) {
    let manager = new PDFMerger();
    let [data] = await getTmpVal(orderNumber);
    //
    let pdfArrayBuffer;
    data.pdfStrs.forEach((pdfStr: string, idx: number) => {
        if (idx === dataIdx) {
            pdfArrayBuffer = (PDFBufferData.arrayBuffSerializableStringToArrayBuff(pdfStr));
            if (pdfArrayBuffer) {
                manager.add(pdfArrayBuffer).then(async () => {
                    let blob = await manager.saveAsBlob()
                    let url = URL.createObjectURL(blob);
                    setSrc(url);
                });
            }
        }
    });

}

async function getTmpVal(orderNumber: string) {
    return new OrderPDFCacheDataStore().getData(orderNumber);
}