let navBar2 = document.querySelector(".nav-bar");
let navBar3 = document.querySelector("#navBar3");
let btns = document.querySelectorAll(".hamburger-parent, .nav-main, .nav-inside-contact");
let navWrapper = document.querySelector(".nav-wrapper");
let nav = navWrapper.querySelector("nav");
let navImage = document.querySelector("#image");




btns.forEach((btn) => {
    btn.addEventListener("click", function () {
        navImage.classList.toggle("open-image");
        console.log('オープン！！');
        navBar2.classList.toggle("open-nav-bar");
        navBar3.classList.toggle("open-nav-bar");
    });
});


btns.forEach(onclick = (btn) => {
    btn.addEventListener("click", function () {
        if (navWrapper.classList.contains("open-nav-wrapper")) {
            navWrapper.classList.add("close-nav-wrapper");
            navWrapper.classList.remove("open-nav-wrapper");
        } else {
            navWrapper.classList.add("open-nav-wrapper");
            navWrapper.classList.remove("close-nav-wrapper");
        }
    });
});

nav.addEventListener("animationend", () => { //cssのanimationが100%に達した時に発火される。
    if (navWrapper.classList.contains("close-nav-wrapper")) { //closeNavが終わった時
        navWrapper.classList.remove("close-nav-wrapper");
        navWrapper.classList.remove("open-nav-wrapper");
        console.log('close-nav-wrapper');
    }
})

// お問い合わせボタン
const CONTACT_ELEM_SELECTOR =".nav-inside-contact";
// オーバーレイのナビゲーション内のリンク
const NAVIGATION_LINK_SELECTOR = ".nav-item";
// オーバーレイのナビゲーションリンクのラッパー要素
// リンクを踏まないとスムーススクロールしないので、リンクのラッパー要素は無くていいかと思います。
const NAVIGATION_LINK_WRAPPER_SELECTOR = ".nav-main";

// 開く処理を行う要素をすべて取得
const closeTargets = document.querySelectorAll([CONTACT_ELEM_SELECTOR,NAVIGATION_LINK_SELECTOR].join(","));
// 閉じる処理を行う要素をすべて取得
const openCloseTargets =document.querySelectorAll(".hamburger-parent");

// 開く処理のイベントを設定
openCloseTargets.forEach(elem=>{
    elem.addEventListener("click",()=>{
        // 開いているなら閉じて、閉じているなら開く
        if (navWrapper.classList.contains("open-nav-wrapper")) {
            navWrapper.classList.add("close-nav-wrapper");
            navWrapper.classList.remove("open-nav-wrapper");
        } else {
            navWrapper.classList.add("open-nav-wrapper");
            navWrapper.classList.remove("close-nav-wrapper");
        }
    })
})
// 閉じる処理を行う要素を取得
closeTargets.forEach(elem=>{
    elem.addEventListener("click",()=>{
        // もし、既に閉じていたら何もしない
        if (navWrapper.classList.contains("open-nav-wrapper")) {
            navWrapper.classList.add("close-nav-wrapper");
            navWrapper.classList.remove("open-nav-wrapper");
        }
    })
})
