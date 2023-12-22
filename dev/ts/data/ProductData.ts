import {OrderInvoiceParam} from "./OrderInvoiceParam";

export class ProductData    {
    private _detailPageUrl:string;
    private _mainImgSrc:string;
    private _title:string;

    get detailPageUrl(): string {
        return this._detailPageUrl;
    }

    set detailPageUrl(value: string) {
        this._detailPageUrl = value;
    }

    get mainImgSrc(): string {
        return this._mainImgSrc;
    }

    set mainImgSrc(value: string) {
        this._mainImgSrc = value;
    }

    get title(): string {
        return this._title;
    }

    set title(value: string) {
        this._title = value;
    }
}