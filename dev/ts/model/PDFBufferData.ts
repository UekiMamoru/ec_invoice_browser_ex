export class PDFBufferData{


    static arrayBufferToStringSerializable(arrayBuff: ArrayBufferLike) {

        const base64String = PDFBufferData.arrayBufferToBase64(arrayBuff);
        return base64String
    }

    static arrayBufferToBase64(buffer: ArrayBufferLike) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;

        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }

        return window.btoa(binary);
    }

    static arrayBuffSerializableStringToArrayBuff(str: string): ArrayBufferLike {
        const newArrayBuffer = PDFBufferData.base64ToArrayBuffer(str);
        return newArrayBuffer;
    }

    static base64ToArrayBuffer(base64: string): ArrayBufferLike {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

}