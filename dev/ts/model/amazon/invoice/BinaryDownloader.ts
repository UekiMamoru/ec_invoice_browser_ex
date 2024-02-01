export class BinaryDownloader {


    async getPDFArrayBuffer(
        url = 'https://www.amazon.co.jp/documents/download/812ccde1-8a52-4f91-a4e3-8d0a9638bc56/invoice.pdf',
        options = {}
    ) {
        let res = await fetch(url);
        let arrayBuff = await res.arrayBuffer();
        return arrayBuff;
    }

}