export class GetAllProductUrlView
{

    constructor(src = "") {
        this._src = src
    }

    set src(_) {
        this._src = _;
    }

    /**
     *
     * @returns {Promise<{urls:string[],lastIndex:number}>}
     */
    async exec() {
        return new Promise(
            (resolve) => {
                let src = this._src;//`/gp/your-account/order-history?orderFilter=year-${year}`;
                let firstFrame = document.createElement("iframe");
                let func = (event) => {
                    if (event.data.hasOwnProperty("href") &&
                        event.data.href.replace(location.origin, "") === src) {
                        if (event.data.state) {
                            // データが取れたので、イベントをデタッチ
                            window.removeEventListener("message", func, false);
                            document.body.removeChild(firstFrame);
                            let productNodes = this.parser(event.data.nodeStr);
                            let lastIndex = event.data.lastIndex;
                            // ページネーションから終端を取得
                            // 開いたフレームの削除
                            // ページネーションが存在しない可能性があるので、例外処理
                            // lastIndexからURLを生成してコールバック呼び出し
                            resolve({productNodes, lastIndex})
                        }
                    }
                };
                window.addEventListener(
                    "message",
                    func,
                    false,
                );

                firstFrame.src = src;
                document.body.appendChild(firstFrame);
            }
        )
    }


    parser(nodeStr) {

        // 取得データをパージ
        // 現在の履歴一覧を削除
        // document.querySelectorAll(`.order-card.js-order-card,.order.js-order-card`).forEach(e => e.parentElement.removeChild(e));
        let parser = new DOMParser();
        let node = parser.parseFromString(nodeStr, "text/html")
        let list = Array.from(node.querySelectorAll(".order.js-order-card"))
        return list
    }

}