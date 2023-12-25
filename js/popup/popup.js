(()=>{

    const EC_KEY_PREFIX = "ec_"
    let ecName = "amazon";
    let key = `${EC_KEY_PREFIX}${ecName}`;
    let list = [key];
    chrome.storage.local.get(list, (result) => {
        let data = result[key];
        // もしデータがなければ配列にする
        if (data) {
            // もしデータがあれば、オプションページのボタンを作成する
            let resultAmazonOpen = document.getElementById(`resultAmazonOpen`)
            resultAmazonOpen.style.display = "block";
            resultAmazonOpen.addEventListener("click",()=>{
                chrome.tabs.create({url:chrome.runtime.getURL("/option/invoice-cache.html?ec=amazon")})
            })
        }

    });
})()