import * as pdfjsLib from 'pdfjs-dist/webpack.mjs';

d()

async function d() {
    let url = chrome.runtime.getURL('js/vendors-node_modules_pdfjs-dist_build_pdf_worker_mjs.js');
    pdfjsLib.GlobalWorkerOptions.workerSrc = url

    const AMAZON_EC_NAME = "amazon"
    let getVal = {
        ecName: AMAZON_EC_NAME,
        orderNumber: "503-3116098-9223044",
        type: "get-ec-pdf-data",

    }
    let result = await chrome.runtime.sendMessage(getVal);
    let arrayBuff = arrayBuffSerializableStringToArrayBuff(result.data.pdfStrs[0])


    var loadingTask = pdfjsLib.getDocument(arrayBuff);
    let pdf = await loadingTask.promise
    console.log('PDF loaded');

    // Fetch the first page
    var pageNumber = 1;
    let page = await pdf.getPage(pageNumber)
    console.log('Page loaded');

    var scale = 1.5;
    var viewport = page.getViewport({scale: scale});

    // Prepare canvas using PDF page dimensions
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    // canvas
    // Render PDF page into canvas context
    var renderContext = {
        canvasContext: context,
        viewport: viewport
    };
    var renderTask = page.render(renderContext);
    // renderTask.promise.then(function () {
    //     console.log('Page rendered');
    await sleep(300)
    page.getTextContent().then(
        (v) => {
            let items = v.items;
            console.log(items[0].str.match("適格請求書"))
            let target = items.find(d => {
                return d.str.match("登録番号: T")
            })
            console.log(target)
            canvas.height = 0;
            canvas.width = 0;
            canvas.remove();
            // delete context;
            // delete canvas;
        }
    )

    // }).catch(ee=>{
    //     console.log(ee)
    // });


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
    async function sleep(milSec = 1000){
        return new Promise(resolve => {
            setTimeout(()=>resolve(),milSec)
        })
    }
}