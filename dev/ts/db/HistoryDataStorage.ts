export class HistoryDataStorage {
    private EC_KEY_PREFIX = "ec_";

    constructor() {
    }

    async getEcOrder(ecName: string, prop: { orderNumber: string }): Promise<any|null>{
        let all= await this.getEcAll(ecName);
        if(all.hasOwnProperty(prop.orderNumber)){
            return all[prop.orderNumber];
        }
        return null;
    }

    async getEcAll(ecName: string): Promise<{[key:string]:any|undefined}> {
        return new Promise(async r=>{

            let key = this.EC_KEY_PREFIX + ecName;
            let result = await chrome.storage.local.get([key]);
            if (!result[key]) {
                r({})
            }
            r(result[key]);
        });
    }

    async setEcOrder() {
    }
}