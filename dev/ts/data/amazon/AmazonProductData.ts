import {ProductData} from "../ProductData";

class AmazonProductData extends ProductData{
    private _asin:string;
    get asin(): string {
        return this._asin;
    }
    set asin(value: string) {
        this._asin = value;
    }
}