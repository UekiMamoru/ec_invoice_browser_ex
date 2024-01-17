export class ProductDataInserter {
    constructor() {
    }


    flush() {
        // 現在の履歴一覧を削除
        let container = this.getContainer();
        container.querySelectorAll(`.order-card.js-order-card,.order.js-order-card`)
            .forEach(e => e.parentElement!.removeChild(e));
        container.querySelectorAll(`script`)
            .forEach((s) => s.parentElement!.removeChild(s));
    }

    inserts(productNodes: Element[]) {
        let container = this.getContainer();
        productNodes.forEach(node => {
            container.appendChild(node);
        })
    }

    getContainer() {
        let container = document.querySelector("#ordersContainer,.js-yo-main-content");
        if (container === null) {
            throw new Error("insert target not found")
        }
        return container;
    }

    getAppendTarget() {

    }

    hidePagination() {
        // ページネーションが存在しない可能性があるので、例外処理
        try {
            // ページを移動しない様にページネーションをhide
            let element = this.getContainer()
                .querySelector(".a-pagination")
            if (element instanceof HTMLElement) {
                element.style.display = "none";
            }
        } catch (e) {

        }
    }
}