import {AmazonOrderDataObj} from "../../../react/types";
import {Logger} from "../../../lib/Logger";

export class AmazonHistoryElementDataConverter {
    private _logger :Logger;
    constructor() {
        this._logger =new Logger();
    }

    set logger(_:Logger){
        this._logger = _;
    }

    elementToAmazonOrderDataObj(node:HTMLElement){

        let orderObj: AmazonOrderDataObj
            = {
            no: ""
            , productList: []
            , date: ""
            , price: {
                total: ""
            }
            , invoiceData: {url: ""}
            , isDigital: false
        }
        orderObj.no = node.querySelector(`.yohtmlc-order-id .value,.yohtmlc-order-id [dir="ltr"]`)!.textContent!.trim()
        // todo 複数ある場合があるので先頭のみ、ただデータとしては取得する可能性あり
        // todo 商品リンクとASINは保持
        let linkNodes = Array.from(node.querySelectorAll("a"))
            .filter(node => node.href)
            .filter(node => node.href.match(/\/[A-Z,0-9]{10}[/|?]/))
        let titles = linkNodes
            .filter(a => !a.querySelector("img"));
        let images = linkNodes
            .filter(a => a.querySelector("img"));
        titles.forEach((titleLinkNode, index) => {
            //
            let href = titleLinkNode.href;
            if (!href) href = "";
            let matched = href.match(/\/[A-Z,0-9]{10}[/|?]/);
            let asin = "";
            if (matched) {
                asin = matched[0]
                    .replaceAll("/", "")
                    .replaceAll("?", "");
            }
            let title = titleLinkNode.textContent ? titleLinkNode.textContent : "";
            let imageWrapLinkNode = images[index];
            let img = imageWrapLinkNode.querySelector("img");

            let imgSrc = "";
            if (img) {
                let src = img.getAttribute("src")
                if (src) {
                    imgSrc = src;
                }
                src = img.getAttribute("data-src")
                if (src) {
                    imgSrc = src;
                }
            }
            orderObj.productList.push(
                {asin, href, title, imgSrc}
            )

        })
        //
        let priceTotalNode = node.querySelector(`.yohtmlc-order-total .value,.yohtmlc-order-total`);
        if (priceTotalNode) {
            orderObj.price.total = priceTotalNode.textContent!.trim()
        }
        let dataNode = Array.from(node.querySelectorAll(`.order-header span,.order-info span`))
            .find(e => e.textContent!.trim().match(/[0-9]{4}年[0-9]{1,2}月[0-9]{1,2}日/));
        if (dataNode) {
            orderObj.date = dataNode.textContent!.trim()
        }
        // ヘッダーの日付フォーマットを取得
        // キャンセルの場合、領収書等がでないのでその時点でnull返却
        try {
            orderObj.invoiceData = this.getInvoiceURLFormatObject(node);
        } catch (e) {
            // エラーとなった注文番号は知りたいので、ログに出す
            this.exportUserLogMsg(`${orderObj.no}は領収書が有りません`)
            return null
        }
        orderObj.isDigital = Boolean(orderObj.no.match(/^D/))
        return orderObj;
    }
   private exportUserLogMsg(msg:string){
        this._logger.log(msg)
    }



  private  getInvoiceURLFormatObject(node: HTMLElement): any {
        let nodeList: HTMLElement[] = Array.from(node.querySelectorAll(`.order-info .yohtmlc-order-level-connections [data-a-popover],.order-header .yohtmlc-order-level-connections [data-a-popover]`));
        if (nodeList) {
            let invoiceTarget = nodeList.filter(elem => ~(elem.textContent!.indexOf("領収書")))[0];
            if (invoiceTarget) {
                let jsonData = invoiceTarget.getAttribute("data-a-popover");
                if (jsonData) return JSON.parse(jsonData)
            }
        }
        throw new Error("invoice data not found");


    }
}