import {PDFBufferData} from "../ts/model/PDFBufferData";
import PDFMerger from 'pdf-merger-js/browser';

const EC_KEY_PREFIX = "ec_";
const ecName = "amazon";
(() => {
    let key = `${EC_KEY_PREFIX}${ecName}`;
    let list = [key];
    let manager = new PDFMerger();
    chrome.storage.local.get(list, async (data) => {
        let keyData = data[key];
        console.log(keyData);

        let keys = Object.keys(keyData);
        for (let key of keys) {
            let pdfStrs = keyData[key].pdfStrs;
            let arrayBuff = PDFBufferData.arrayBuffSerializableStringToArrayBuff(pdfStrs[0]);
            await manager.add(arrayBuff);

        }


        const mergedPdf = await manager.saveAsBlob();
        const url = URL.createObjectURL(mergedPdf);
        const iframe = document.createElement("iframe")
        iframe.width = "100%";
        iframe.height = "1000px";
        iframe.src = url;
        document.body.appendChild(iframe)
    })
})()