import * as pdfjsLib from 'pdfjs-dist/webpack.mjs';
import {Thread} from "./content/util/Thread";

chrome.runtime.onMessage.addListener((message, p, callback) => {
    if (message.type === "offscreen-pdf-decode") {
        getPDFTypeNum(message.pdfStr).then((result) => {
            callback(result);
        })
    }
    return true;
})

async function getPDFTypeNum(pdfStr = "") {
    let url = chrome.runtime.getURL('js/vendors-node_modules_pdfjs-dist_build_pdf_worker_mjs.js');
    pdfjsLib.GlobalWorkerOptions.workerSrc = url

    const AMAZON_EC_NAME = "amazon"
    let getVal = {
        ecName: AMAZON_EC_NAME,
        orderNumber: "503-3116098-9223044",
        type: "get-ec-pdf-data",

    }
    let arrayBuff = arrayBuffSerializableStringToArrayBuff(pdfStr)

    let loadingTask = pdfjsLib.getDocument(arrayBuff);
    let pdf = await loadingTask.promise
    console.log('PDF loaded');

    // Fetch the first page
    let pageNumber = 1;
    let page = await pdf.getPage(pageNumber)
    console.log('Page loaded');

    let scale = 1.5;
    let viewport = page.getViewport({scale: scale});

    // Prepare canvas using PDF page dimensions
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    // canvas
    // Render PDF page into canvas context
    let renderContext = {
        canvasContext: context,
        viewport: viewport
    };
    let renderTask = page.render(renderContext);
    // renderTask.promise.then(function () {
    //     console.log('Page rendered');
    await Thread.sleep(300)
    let v = await page.getTextContent();
    let items = v.items;
    console.log(items[0].str.match("適格請求書"))
    let target = items.find(d => {
        return d.str.match("登録番号: T")
    })
    console.log(target)
    let pdfData = {
        type: items[0].str.trim(),
        invoiceId: target ? target.str.trim() : "",
        isInvoice: false
    }
    // インボイスかどうかは登録番号の有無で判定したほうがいいかも
    // 表示にも利用する
    pdfData.isInvoice = Boolean(pdfData.type.match("適格") && (pdfData.invoiceId));
    canvas.height = 0;
    canvas.width = 0;
    canvas.remove();
    return pdfData;

}


function arrayBuffSerializableStringToArrayBuff(str) {
    const newArrayBuffer = base64ToArrayBuffer(str);
    return newArrayBuffer;
}

function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
}
