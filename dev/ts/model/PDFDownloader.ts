export class PDFDownloader{
    static downloadPDF(arrayBuffer: ArrayBufferLike, fileName: string) {

        // ここでnewArrayBufferを使用する
        const objectUrl = URL.createObjectURL(new Blob([arrayBuffer]));
        const objectLink = document.createElement('a');
        objectLink.href = objectUrl;
        objectLink.setAttribute('download', `${fileName}.pdf`);
        document.body.appendChild(objectLink);
        objectLink.click();
        URL.revokeObjectURL(objectLink.href);
        document.body.removeChild(objectLink);
        // objectLink.revokeObjectURL();
    }

}