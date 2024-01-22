export class OrderPDFCacheDataStore {
    async getData(orderNumber: string) {
        const AMAZON_EC_NAME = "amazon"
        let getVal = {
            ecName: AMAZON_EC_NAME,
            orderNumber,
            type: "get-ec-pdf-data",
        }
        let result = await chrome.runtime.sendMessage(getVal);
        // 既にあったので、既存データで作成
        // exportUserLogMsg(`キャッシュに存在していたため、キャッシュデータを利用します。`)
        let data = result.data
        let fileName = result.data.fileName;
        return [data, fileName];
    }

    async getAllCacheData(list:string[]){
        return  await chrome.storage.local.get(list);
    }
}