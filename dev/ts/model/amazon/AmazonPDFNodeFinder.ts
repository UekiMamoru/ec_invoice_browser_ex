export class AmazonPDFNodeFinder{
    async find(invoiceURL:string){
        /**
         * <ul class="a-unordered-list a-vertical invoice-list a-nowrap">
         *     <li><span class="a-list-item">
         *         <a class="a-link-normal" href="/documents/download/b62c4b4e-5338-4ab9-8358-ce73b3978302/invoice.pdf">
         *             支払い明細書 1
         *         </a>
         *     </span></li>
         *     <li><span class="a-list-item">
         *         <a class="a-link-normal" href="/gp/help/contact/contact.html/ref=oh_aui_ajax_request_invoice?ie=UTF8&amp;orderID=250-4129616-1192621&amp;sellerID=A1NLN7B5GTL0T6&amp;subject=30">
         *             請求書をリクエスト
         *         </a>
         *     </span></li>
         *     <li><span class="a-list-item">
         *         <a class="a-link-normal" href="/gp/css/summary/print.html/ref=oh_aui_ajax_invoice?ie=UTF8&amp;orderID=250-4129616-1192621">
         *             領収書／購入明細書
         *         </a>
         *     </span></li>
         * </ul>
         */
        // 請求書をリクエストのテキストがある場合は適格者の物ではない、この場合はオーダーIDで引っ張る
        //
        //
        // 複数あるケース
        /*
        <ul class="a-unordered-list a-vertical invoice-list a-nowrap">
<li><span class="a-list-item">
<a class="a-link-normal" href="/documents/download/904878fd-1644-474c-a804-99a766097133/invoice.pdf">
    支払い明細書 1
</a>
</span></li>
<li><span class="a-list-item">
<a class="a-link-normal" href="/documents/download/f4f29d4e-7604-4650-aa67-07b348c15db4/invoice.pdf">
    支払い明細書 2
</a>
</span></li>
<li><span class="a-list-item">
<a class="a-link-normal" href="/documents/download/26e3893b-8acc-4dce-ba8c-56e8eaf7ba45/invoice.pdf">
    支払い明細書 3
</a>
</span></li>
<li><span class="a-list-item">
<a class="a-link-normal" href="/gp/css/summary/print.html/ref=oh_aui_ajax_invoice?ie=UTF8&amp;orderID=250-0400874-3412639">
    領収書／購入明細書
</a>
</span></li>
</ul>
         */
        let url = `https://www.amazon.co.jp${invoiceURL}`;
        // urlをフェッチリクエストしてPDFリンクを生成
        // exportUserLogMsg(`PDFが存在するか確認します...`)
        let res = await fetch(url);
        let text = await res.text();
        let parser = new DOMParser();
        let invoiceLinkDocument = parser.parseFromString(text, "text/html");
        let target: HTMLAnchorElement[] = Array.from(invoiceLinkDocument.querySelectorAll<HTMLAnchorElement>(`.invoice-list a[href$="invoice.pdf"]`));
        return {target, invoiceLinkDocument};
    }

    getSellerContactURLs(invoiceLinkNode:Document){
        let urlLinkNodes : HTMLAnchorElement[];
        let sellerContactURLs:string[] = []
        if (invoiceLinkNode.body.innerHTML.indexOf("help/contact/contact.html") !== -1) {
            // 発見したので適格領収書ではない可能性があるがこの時点では特定できない
            // fileName = `_${fileName}`
            urlLinkNodes = Array.from(invoiceLinkNode.body.querySelectorAll<HTMLAnchorElement>(`a[href*="help/contact/contact.html"]`));
            urlLinkNodes.forEach(elem => {
                if (elem instanceof HTMLAnchorElement) {
                    let href = elem.href
                    if (href) {
                        sellerContactURLs.push(href)
                    }
                }
            });
            //.href;
            // isInvoice = false;
            // // exportUserLogMsg(`PDFは適格領収書ではないかもしれません`)
        }
        return sellerContactURLs;
    }

    isReceipt(invoiceLinkNode:Document){

        // todo .pdfで終わるものが無かったので、ここはエラーを保持して警告出す
        // A.発送や会計処理終わってないケース
        // <a class="a-link-normal" hrclassNamegp/help/customer/display.html/ref=oh_aui_ajax_legal_invoice_help?ie=UTF8&amp;nodeId=201986650">
        //             領収書／購入明細書がご利用になれません。くわしくはこちら。
        //         </a>

        invoiceLinkNode.querySelectorAll(`a`)
        let target = Array.from(invoiceLinkNode.querySelectorAll("a"))
            .find(a => {
                if (a.textContent) {
                    return a.textContent.indexOf("領収書／購入明細書がご利用になれません。") !== -1
                }
                return false;
            });
        return Boolean(target instanceof HTMLAnchorElement);
    }
}