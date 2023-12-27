import {OrderInvoiceParam} from "./OrderInvoiceParam";
import {json} from "react-router-dom";

export class ProductData    {
    private _detailPageUrl:string="";
    private _mainImgSrc:string="";
    private _title:string="";

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

    toJSON():{[key:string]:string}{
        return {
            detailPageUrl: this.detailPageUrl,
            mainImgSrc: this.mainImgSrc,
            title: this.title
        };
    }

    toInstance(json:{[key:string]:string}):void{
        this.detailPageUrl = json.detailPageUrl;
        this.mainImgSrc = json.mainImgSrc;
        this.title = json.title;
    }
}