amazonOrderPageFrame()

function amazonOrderPageFrame() {

    if (!isOrderPage()) {
        return;
    }
    let message = {nodeStr: null, data: {}, state: false}
    // 根本的にデータが無い場合はやめる
    if (noOrder()) {
        window.parent.postMessage(message, "*");
        return;
        ;
    }
    // オブザーバーでBodyの更新を検知
    const observer = new MutationObserver(function () {
        // Nodeがあるかどうか
        let list = getOrderList();
        if (list.length) {
            observer.disconnect()
            // Node有ったのでメッセージ投げてobserverの監視終了
            let wrap = document.createElement("div");
            list.forEach(d => wrap.appendChild(d.cloneNode(true)))
            message.state = true;
            message.nodeStr = wrap.innerHTML;
            // message.data = list;
            message.href = location.href;
            // ページングの最後のデータを取得
            message.lastIndex = (document.querySelector(`.a-pagination .a-last`).previousElementSibling.querySelector("a").textContent.trim()-0)-1
            window.parent.postMessage(message, "*");

        }
    });
    const config = {
        subtree: true, childList: true
    };
    observer.observe(document.body, config);


    function getOrderList() {
        let list =  Array.from(document.querySelectorAll(".order.js-order-card,.order-card.js-order-card"));
        return list.filter(e=>!e.parentElement.classList.contains("js-order-card"))
    }

    // // オーダーリストが取れるまで待ってメッセージパッシング
    // setTimeout(() => {
    //     window.parent.postMessage(document.body.innerHTML, "*");
    // }, 500)

    function isOrderPage() {
        return location.pathname.match('/gp/your-account/order-history')
            || location.pathname.match("/gp/css/order-history")
            || location.pathname.match(`/your-orders/orders`)
    }

    function noOrder() {
        return false;
    }
}