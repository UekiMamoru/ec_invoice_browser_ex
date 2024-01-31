import JSZip from "jszip";

export class PDFDownloader {
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

    static downloadZipPDF(zip: JSZip,ym:string) {
        zip.generateAsync({type: "base64"}).then(function (base64) {
            let objectUrl = "data:application/zip;base64," + base64;


            const objectLink = document.createElement('a');
            objectLink.href = objectUrl;
            objectLink.setAttribute('download', `${ym}.zip`);
            document.body.appendChild(objectLink);
            objectLink.click();
            URL.revokeObjectURL(objectLink.href);
            document.body.removeChild(objectLink);
            // objectLink.revokeObjectURL();

        });
    }

}