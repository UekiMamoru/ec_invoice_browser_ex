/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./dev/js/content/util/Thread.js":
/*!***************************************!*\
  !*** ./dev/js/content/util/Thread.js ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Thread: () => (/* binding */ Thread)
/* harmony export */ });
class Thread
{
    static sleep(milSec = 1000) {
        return new Promise(r => setTimeout(r, milSec));
    }
}

/***/ }),

/***/ "./dev/js/content/view/GetAllProductUrlView.js":
/*!*****************************************************!*\
  !*** ./dev/js/content/view/GetAllProductUrlView.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GetAllProductUrlView: () => (/* binding */ GetAllProductUrlView)
/* harmony export */ });
class GetAllProductUrlView
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

/***/ }),

/***/ "./dev/js/content/view/ProductDataInserter.js":
/*!****************************************************!*\
  !*** ./dev/js/content/view/ProductDataInserter.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ProductDataInserter: () => (/* binding */ ProductDataInserter)
/* harmony export */ });
class ProductDataInserter
{
    constructor() {
    }


    flush() {
        // 現在の履歴一覧を削除
        let container = this.getContainer();
        container.querySelectorAll(`.order-card.js-order-card,.order.js-order-card`).forEach(e => e.parentElement.removeChild(e));
        container.querySelectorAll(`script`)
            .forEach((s) => s.parentElement.removeChild(s));
    }

    inserts(productNodes) {
        let container = this.getContainer();
        productNodes.forEach(node => {
            container.appendChild(node);
        })
    }

    getContainer() {
        let container = document.querySelector("#ordersContainer,.js-yo-main-content");
        return container;
    }

    getAppendTarget() {

    }

    hidePagination() {
        // ページネーションが存在しない可能性があるので、例外処理
        try {
            // ページを移動しない様にページネーションをhide
            this.getContainer().querySelector(".a-pagination").style.display = "none";
        } catch (e) {

        }
    }
}

/***/ }),

/***/ "./dev/js/content/view/ViewLogger.js":
/*!*******************************************!*\
  !*** ./dev/js/content/view/ViewLogger.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ViewLogger: () => (/* binding */ ViewLogger)
/* harmony export */ });
class ViewLogger
{

    constructor() {

        /**
         *
         * @type {HTMLElement}
         * @private
         */
        this._field = null;
    }

    set field(_) {
        this._field = _
    }

    log(msg) {
        let msgP = document.createElement("p")
        msgP.innerHTML = msg;
        msgP.style.margin = "0";
        msgP.style.paddingBottom = ".15em";
        msgP.style.color = "white";
        msgP.style.fontSize = "12px";
        this._field.prepend(msgP);
    }
}

/***/ }),

/***/ "./dev/js/content/view/ctrl/AmazonHistoryCtrlLock.js":
/*!***********************************************************!*\
  !*** ./dev/js/content/view/ctrl/AmazonHistoryCtrlLock.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AmazonHistoryCtrlLock: () => (/* binding */ AmazonHistoryCtrlLock)
/* harmony export */ });
/* harmony import */ var _CtrlLock__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CtrlLock */ "./dev/js/content/view/ctrl/CtrlLock.js");


class AmazonHistoryCtrlLock extends _CtrlLock__WEBPACK_IMPORTED_MODULE_0__.CtrlLock
{

    constructor() {
        super();
        this._lockTargetSelectors = []
        /**
         *
         * @type {ViewLogger}
         * @private
         */
        this._logger = null
    }

    set logger(_){
        this._logger =  _
    }
    set lockTargetSelectors(_) {
        this._lockTargetSelectors = _;
    }

    lock() {
        super.lock();
        this._logger.log(`ロックします`)
        this._lockTargetSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(
                elem => {

                    elem.setAttribute("disabled", "disabled")
                }
            )
        })
    }

    unlock() {
        super.unlock();
        this._logger.log(`アンロックします`)
        this._lockTargetSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(
                elem => {
                    elem.removeAttribute("disabled", "disabled")
                }
            )
        })
    }
}

/***/ }),

/***/ "./dev/js/content/view/ctrl/CtrlLock.js":
/*!**********************************************!*\
  !*** ./dev/js/content/view/ctrl/CtrlLock.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CtrlLock: () => (/* binding */ CtrlLock)
/* harmony export */ });
class CtrlLock
{

    constructor() {
        this._isLock = false;
    }

    get isLock() {
        return this._isLock;
    }

    lock() {
        this._isLock = true;
    }

    unlock() {
        this._isLock = false;
    }
}

/***/ }),

/***/ "./dev/js/content/view/eff/LoaderEffect.js":
/*!*************************************************!*\
  !*** ./dev/js/content/view/eff/LoaderEffect.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LoaderEffect: () => (/* binding */ LoaderEffect)
/* harmony export */ });
class LoaderEffect
{
    constructor(_progressElement) {
        this._start = 0;
        this._end = 10;
        /**
         * @type HTMLProgressElement
         * @private
         */
        this._progressElement = _progressElement
    }


    get start() {
        return this._start;
    }

    set start(value) {
        this._start = value;
    }

    get end() {
        return this._end;
    }

    set end(value) {
        this._end = value;
    }

    show() {
        this._progressElement.style.display = "block"
    }

    hide() {
        this._progressElement.style.display = "none"
    }

    start(_last) {
        this._end = _last;
        this._progressElement.max = this._end;
    }

    update(_) {
        this._progressElement.value = _;
    }

    stop() {
    }

    flush() {
    }
}

/***/ }),

/***/ "./dev/js/content/vm/TermProductDataInsertVM.js":
/*!******************************************************!*\
  !*** ./dev/js/content/vm/TermProductDataInsertVM.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TermProductDataInsertVM: () => (/* binding */ TermProductDataInsertVM)
/* harmony export */ });
/* harmony import */ var _view_ProductDataInserter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../view/ProductDataInserter */ "./dev/js/content/view/ProductDataInserter.js");
/* harmony import */ var _view_GetAllProductUrlView__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../view/GetAllProductUrlView */ "./dev/js/content/view/GetAllProductUrlView.js");
/* harmony import */ var _util_Thread__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/Thread */ "./dev/js/content/util/Thread.js");




class TermProductDataInsertVM
{
    constructor() {
        /**
         * @type {ProductDataInserter}
         */
        this._inserter = null;

        /**
         *
         * @type {LoaderEffect}
         * @private
         */
        this._loader = null;

        this._year = "";

        this._lastIndex = 0;


        /**
         *
         * @type {ViewLogger}
         * @private
         */
        this._logger = null;


        /**
         *
         * @type {LoaderEffect}
         * @private
         */
        this._progress = null;
        /**
         *
         * @type {HTMLElement}
         * @private
         */
        this._resultElement = null
    }

    set resultElement(_){
        this._resultElement  = _;
    }

    set logger(value) {
        this._logger = value;
    }

    get inserter() {
        return this._inserter;
    }

    set inserter(value) {
        this._inserter = value;
    }

    get loader() {
        return this._loader;
    }

    set loader(value) {
        this._loader = value;
    }

    get year() {
        return this._year;
    }

    set year(value) {
        this._year = value;
    }

    get lastIndex() {
        return this._lastIndex;
    }

    set lastIndex(value) {
        this._lastIndex = value;
    }


    get progress() {
        return this._progress;
    }

    set progress(value) {
        this._progress = value;
    }


    /**
     *
     * @param cacheData {{target:number,data:HTMLElement[],lastIndex:number}}
     */
    execDraw(cacheData) {
        let inserter = this._inserter;
        let logger = this._logger;
        this._progress.show();
        logger.log(`現在の表示をフラッシュします`);
        inserter.flush();
        logger.log(`現在の表示をフラッシュしました`);
        this._progress.start(cacheData.lastIndex)
        cacheData.data.forEach((productNodes, index) => {

            this._progress.update(index)
            inserter.inserts(productNodes);
        })
        this._progress.update(cacheData.lastIndex)
        this._progress.hide();
        this.result(cacheData.target,cacheData.data);
        return;
    }

    /**
     *
     * @return {Promise<{target:number,data:HTMLElement[],lastIndex:number}>}
     */
    async exec() {
        let inserter = this._inserter;
        let logger = this._logger;
        let cacheNodes = [];
        this._progress.show();
        logger.log(`現在の表示をフラッシュします`);
        inserter.flush();
        logger.log(`現在の表示をフラッシュしました`);
        let firstUrlView = new _view_GetAllProductUrlView__WEBPACK_IMPORTED_MODULE_1__.GetAllProductUrlView();
        let year = this._year;
        firstUrlView.src = this.createAccessURL(year)
        this._progress.start(300)

        logger.log(`選択された[${year}]の1ページ目を取得します`);
        let {productNodes, lastIndex}
            = await firstUrlView.exec(year);

        logger.log(`選択された[${year}]の1ページ目を取得しました。最終ページは${lastIndex}です。`);
        this._lastIndex = lastIndex;
        this._progress.start(
            lastIndex
        )
        this._progress.update(1)
        cacheNodes.push(productNodes);
        inserter.inserts(productNodes);
        logger.log(`選択された[${year}]の1ページ目のデータを挿入します`);
        let urls = this.createAccessURLs(year, this._lastIndex);
        logger.log(`最終ページをもとに[${year}]アクセスするURLを生成します.`);
        this._progress.end = this._lastIndex;
        const PARALLEL_PROCESS_COUNT = 3
        for (let i = 0; i < urls.length; i = i + PARALLEL_PROCESS_COUNT) {

            let getViews = this.createGetViews(PARALLEL_PROCESS_COUNT);
            // 3の倍数かどうかはわからないので、無かったら落とす
            getViews.forEach((view, index) => {
                let url = urls[i + index];
                if (url) {
                    view.src = urls[i + index];
                } else {
                    getViews[index] = null;
                }
            });
            let promises = [];
            getViews.forEach(v => {
                if (v) promises.push(v.exec())
            })

            logger.log(`${i + 1}件目～${i + promises.length}件目`);
            logger.log(`並行アクセス数は,${promises.length}件`);
            let results = await Promise.all(promises)
            results.forEach(result => {
                console.log(result);
                inserter.inserts(result.productNodes);
                cacheNodes.push(result.productNodes);
            })
            this._progress.update(i + promises.length)

            logger.log(`取得挿入完了。スリープします。`);
            await _util_Thread__WEBPACK_IMPORTED_MODULE_2__.Thread.sleep(300);
            logger.log(`スリープ終了。次の${PARALLEL_PROCESS_COUNT}件の処理に移ります。`);
        }

        this._progress.update(lastIndex)
        this._progress.hide()
        logger.log(`全件投入完了しました。`);
        this.result(year,cacheNodes);
        return {target: this._year, data: cacheNodes, lastIndex: this._lastIndex}
    }
    result(year,nodesList=[[]]){
        let size = 0;
        nodesList.forEach((list)=>{
            size+=list.length
        })
        this._resultElement.innerHTML=`${year}年は${size}件注文がありました(非表示要素は含まれません)。`;
    }

    createGetViews(createCount) {
        let getViews = [];
        while (getViews.length < createCount) {
            getViews.push(new _view_GetAllProductUrlView__WEBPACK_IMPORTED_MODULE_1__.GetAllProductUrlView());
        }
        return getViews;
    }

    createAccessURLs(year = "", lastIndex = 1) {
        let urls = []
        for (let i = 1; i <= lastIndex; i++) {
            urls.push(this.createAccessURL(year, i))
        }
        return urls;
    }

    createAccessURL(year = "", page = 0) {
        let baseURL = this.accessURL({"orderFilter": `year-${year}`})
        if (page) {
            baseURL += `&startIndex=${page * 10}`
        }
        return baseURL
    }

    accessURL(param = {}) {
        let base = `/gp/your-account/order-history`;
        let queryList = []
        Object.keys(param).forEach((key) => {
            queryList.push(`${key}=${param[key]}&`)
        });

        if (queryList.length) {
            base += "?";
            base += queryList.join("&")
        }

        return base;
    }
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!****************************************!*\
  !*** ./dev/js/content/main/content.js ***!
  \****************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _view_ProductDataInserter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../view/ProductDataInserter */ "./dev/js/content/view/ProductDataInserter.js");
/* harmony import */ var _vm_TermProductDataInsertVM__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../vm/TermProductDataInsertVM */ "./dev/js/content/vm/TermProductDataInsertVM.js");
/* harmony import */ var _view_ViewLogger__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../view/ViewLogger */ "./dev/js/content/view/ViewLogger.js");
/* harmony import */ var _util_Thread__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../util/Thread */ "./dev/js/content/util/Thread.js");
/* harmony import */ var _view_ctrl_AmazonHistoryCtrlLock__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../view/ctrl/AmazonHistoryCtrlLock */ "./dev/js/content/view/ctrl/AmazonHistoryCtrlLock.js");
/* harmony import */ var _view_eff_LoaderEffect__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../view/eff/LoaderEffect */ "./dev/js/content/view/eff/LoaderEffect.js");
/*
<span className="a-declarative" data-action="a-popover"
      data-a-popover="{&quot;url&quot;:&quot;/gp/shared-cs/ajax/invoice/invoice.html?orderId=503-3116098-9223044&amp;relatedRequestId=0VHQAVNXESE1GPZQFT6Q&amp;isADriveSubscription=&amp;isBookingOrder=0&quot;,&quot;position&quot;:&quot;triggerBottom&quot;,&quot;ajaxFailMsg&quot;:&quot;\n\u003cdiv class=\&quot;a-box a-alert-inline a-alert-inline-warning\&quot;>\u003cdiv class=\&quot;a-box-inner a-alert-container\&quot;>\u003ci class=\&quot;a-icon a-icon-alert\&quot;>\u003c/i>\u003cdiv class=\&quot;a-alert-content\&quot;>\n        \u003cspan class=\&quot;a-text-bold\&quot;>\n            請求書の取得中に問題がありました。\n        \u003c/span>\n\u003c/div>\u003c/div>\u003c/div>\n\u003cdiv class=\&quot;a-row a-spacing-top-mini\&quot;>\n    ご注文については、注文の詳細をご覧ください。\n\u003c/div>\n\u003cdiv class=\&quot;a-row\&quot;>\n    \u003ca class=\&quot;a-link-emphasis\&quot; href=\&quot;/gp/your-account/order-details/ref=oh_aui_invorder_details?ie=UTF8&amp;orderID=503-3116098-9223044\&quot;>注文内容を表示\u003c/a>\n\u003c/div>\n&quot;,&quot;activate&quot;:&quot;onclick&quot;}">
    <a href="javascript:void(0)" className="a-popover-trigger a-declarative">
        領収書等
    <i className="a-icon a-icon-popover"></i></a>
</span>
 */







const AMAZON_EC_NAME = "amazon"
amazonOrderPage()

function amazonOrderPage() {

    if (!isOrderPage()) {
        return;
    }

    let viewLogger = new _view_ViewLogger__WEBPACK_IMPORTED_MODULE_2__.ViewLogger();
    const amazonHistoryCtrlLock = new _view_ctrl_AmazonHistoryCtrlLock__WEBPACK_IMPORTED_MODULE_4__.AmazonHistoryCtrlLock();
    amazonHistoryCtrlLock.logger = viewLogger;
    let progressElement = document.createElement("progress");
    const loaderEffect = new _view_eff_LoaderEffect__WEBPACK_IMPORTED_MODULE_5__.LoaderEffect(progressElement);
    let cache = {};
    loaderEffect.hide();

    const EXEC_ELEMENT_ID = `ecInvoiceExec`;
    const EXEC_YEAR_PRODUCT_LIST_ID = `ecYearProductListExec`;
    const INCLUDE_DIGITAL_CHOICE_ID = `ecDigitalChoice`;
    const LOG_MESSAGE_FIELD = `ecLogMsgField`;
    const PDF_GET_AND_DOWNLOAD_CHOICE_ID = `ecPdfGetAndDownload`;
    const PROGRESS_WRAP_ID = `ecProgressBarWrap`;
    const RESULT_FIELD="ecResultField";
    amazonHistoryCtrlLock.lockTargetSelectors = [
        `#${EXEC_ELEMENT_ID}`,
        `#${EXEC_YEAR_PRODUCT_LIST_ID}`,
        `#${INCLUDE_DIGITAL_CHOICE_ID}`,
        `#${PDF_GET_AND_DOWNLOAD_CHOICE_ID}`,
    ]
    let includeDigital = false;
    // オーダーページなので、デジタル以外
    // 動作用フィールドを挿入する
    // todo 動的にページが更新されるので、以降はbodyの更新タイミングで挿入ノードが生きているか監視
    let insertNode = createControlFieldElem();
    let t = getInsertTarget()
    t.prepend(insertNode);
    insertNode.querySelector(`#${PROGRESS_WRAP_ID}`).appendChild(progressElement)
    viewLogger.field = document.getElementById(LOG_MESSAGE_FIELD);
    addEvent();

    function addEvent() {
        let ev = clickEvFunc;
        let changeEv = changeEvFunc
        document.body.addEventListener("click", ev);
        document.body.addEventListener("change", changeEv);
    }

    async function clickEvFunc(event) {
        // ロック中なら何もしない
        let target
            = event.target.closest(`#${EXEC_ELEMENT_ID}`);
        if (target) {
            if (amazonHistoryCtrlLock.isLock) return;
            amazonHistoryCtrlLock.lock();

            // イベント進行中は捨てる
            return createList(event).then(() => {

            }).finally(() => {
                amazonHistoryCtrlLock.unlock();
            })
        }
    }

    async function changeEvFunc(event) {
        if (amazonHistoryCtrlLock.isLock) return;
        let asyncFunc = null;
        if (event.target.closest(`#${EXEC_YEAR_PRODUCT_LIST_ID}`)) {
            asyncFunc = createYearList(event)
        } else if (event.target.closest(`#${INCLUDE_DIGITAL_CHOICE_ID}`)) {
            asyncFunc = changeDigitalChoice(event)
        }


        if (asyncFunc) {
            amazonHistoryCtrlLock.lock();
            asyncFunc.finally(() => {
                loaderEffect.hide();
                amazonHistoryCtrlLock.unlock();
            })
        }
    }

    async function changeDigitalChoice(event) {
        let target = event.target.closest(`#${INCLUDE_DIGITAL_CHOICE_ID}`)
        includeDigital = target.checked;
    }

    async function createYearList(event) {
        let target = event.target.closest(`#${EXEC_YEAR_PRODUCT_LIST_ID}`);
        let year = target.value;
        if (!year) return;
        // 選択期間の取得
        year = year.trim().replaceAll(/[^0-9]/ig, "")
        try {
            document.querySelector(".a-pagination").style.display = "none";
        } catch (e) {

        }
        // キャッシュがあったらキャッシュで描画する
        // キャッシュの有効期限があるので、最後の取得から5分以内はキャッシュ利用
        let vm = new _vm_TermProductDataInsertVM__WEBPACK_IMPORTED_MODULE_1__.TermProductDataInsertVM();
        vm.year = year;
        vm.inserter = new _view_ProductDataInserter__WEBPACK_IMPORTED_MODULE_0__.ProductDataInserter();
        // ページネーション
        vm.logger = viewLogger;
        vm.progress = loaderEffect;
        vm.resultElement = document.querySelector(`#${RESULT_FIELD}`)
        if (cache[year]) {
            vm.execDraw(cache[year])
            return;
        }

        // 非表示
        try {
            document.querySelector(`form[action="/your-orders/orders"]`).style.display = "none";
        } catch (e) {

        }

        let result = await vm.exec();
        cache[year] = result;
        return;
    }

    async function firstDataInsert() {

    }

    /**
     *
     * @param orderObj
     * @param param
     * @returns {{date: string, orderNumber: string, isDigital: boolean, sellerURLs: *, isCreateInvoicePDF: (boolean|*), productDataList: string, sellerContactURLs: [], isMultipleOrder: boolean, invoiceList: ([]|*), sellerURL: (string|string|*), price: string, isQualifiedInvoice: (boolean|*), invoiceId: (string|string|*), isCachePDF: (boolean|*), qualifiedInvoiceReason}}
     */
    function createOrderOutputObject(orderObj, param) {
        let output = {
            orderNumber: orderObj.no,
            date: orderObj.date,
            price: orderObj.price.total,
            isDigital: orderObj.isDigital,
            productDataList: orderObj.title,
            isMultipleOrder: orderObj.title.length > 1,
            isQualifiedInvoice: param.isQualifiedInvoice,
            isCreateInvoicePDF: param.isCreateInvoicePDF,
            qualifiedInvoiceReason: param.qualifiedInvoiceReason,
            sellerContactURLs: param.sellerContactURLs,
            invoiceId: param.invoiceId,
            sellerURL: param.sellerURL,
            sellerURLs: param.sellerURLs,
            isCachePDF: param.isCachePDF,
            invoiceList: param.invoiceList

        }
        return output;
    }

    async function createList(event) {
        if (!event.target.closest(`#${EXEC_ELEMENT_ID}`)) return

        let isPdfGetAndDownload = true;// document.getElementById(PDF_GET_AND_DOWNLOAD_CHOICE_ID).checked;
        let pdfGetAndDownloadMsg = `PDF取得とダウンロードを同時に行います`
        if (!isPdfGetAndDownload) {
            pdfGetAndDownloadMsg = `PDF取得のみ行います`
        }
        exportUserLogMsg(pdfGetAndDownloadMsg)
        exportUserLogMsg(`デジタル${includeDigital ? "を含んだ" : "を含まない"}商品のデータを取得します...`)
        // デジタル以外を取得
        let list = includeDigital ? createOrders() : filterNonDigitalOrders();
        exportUserLogMsg(`対象は${list.length}件です`)
        let resultOrderOutputs = [];
        for (const data of list) {
            if (data) {
                exportUserLogMsg(`注文番号${data.no}の処理を開始します`)
                let fileName = `amazon_${data.date}_${data.no}`
                let isInvoice = false;
                // todo 当該注文番号に紐づくシリアライズしたデータがあるかチェック
                let getVal = {
                    ecName: AMAZON_EC_NAME,
                    orderNumber: data.no,
                    type: "get-ec-pdf-data",

                }
                let param = {
                    isQualifiedInvoice: true,
                    isCreateInvoicePDF: true,
                    qualifiedInvoiceReason: "",

                    sellerContactURLs: [],
                    invoiceList: [],
                }
                /**
                 *
                 * @type {{sellerURL: string, isCreateInvoicePDF: boolean, isQualifiedInvoice: boolean, fileIdx: number, isCachePDF: boolean, invoiceId: string, sellerContactURL: string, qualifiedInvoiceReason: string}}
                 */
                let invoiceListParam = {
                    isQualifiedInvoice: true,
                    isCreateInvoicePDF: true,
                    qualifiedInvoiceReason: "",
                    sellerContactURL: "",
                    sellerURL: "",
                    isCachePDF: false,
                    invoiceId: "",
                    fileIdx: 0
                }
                let result = await chrome.runtime.sendMessage(getVal);
                // 既にあったので、既存データで作成
                let pdfArrayBuffer;
                if (result.state) {
                    exportUserLogMsg(`キャッシュに存在していたため、キャッシュデータを利用します。`)
                    let data = result.data
                    param = result.data.param//.invoiceList;
                    //
                    data.pdfStrs.forEach((pdfStr, idx) => {
                        let fileName = `tmp_${result.data.fileName}${idx > 1 ? idx - 1 : ""}`;
                        pdfArrayBuffer = (arrayBuffSerializableStringToArrayBuff(pdfStr));
                        if (pdfArrayBuffer) {
                            if (isPdfGetAndDownload) downloadPDF(pdfArrayBuffer, fileName);
                        } else {
                            // 何らかのエラーでpdfArrayBufferが作れなかったので、エラーとして注文番号を注文番号を保持
                        }
                        pdfArrayBuffer = "";
                        // param = invoiceListParam;
                    });
                } else {
                    let url = `https://www.amazon.co.jp${data.invoiceData.url}`;
                    // urlをフェッチリクエストしてPDFリンクを生成
                    exportUserLogMsg(`PDFが存在するか確認します...`)
                    let res = await fetch(url);
                    let text = await res.text();
                    let parser = new DOMParser();
                    let invoiceLinkNode = parser.parseFromString(text, "text/html");
                    let target = Array.from(invoiceLinkNode.querySelectorAll(`.invoice-list a[href$="invoice.pdf"]`));
                    // invoice.pdfで判定するが、複数あるケースやインボイスでない場合がある
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


                    if (target.length) {
                        exportUserLogMsg(`${data.no}のオーダーは${target.length}件データが見つかりました`)
                        // もし、「請求書をリクエスト」が存在したら、適格領収書ではない可能性あり
                        let urlLinkNodes = []
                        if (invoiceLinkNode.body.innerHTML.indexOf("help/contact/contact.html") !== -1) {
                            // 発見したので適格領収書ではない可能性があるがこの時点では特定できない
                            // fileName = `_${fileName}`
                            urlLinkNodes = Array.from(invoiceLinkNode.body.querySelectorAll(`[href*="help/contact/contact.html"]`));
                            urlLinkNodes.forEach(elem => param.sellerContactURLs.push(elem.href));
                            //.href;
                            // isInvoice = false;
                            // exportUserLogMsg(`PDFは適格領収書ではないかもしれません`)
                        }
                        let pdfStrs = []
                        for (let i = 0; i < target.length; i++) {
                            let pdfURL = target[i].href
                            let idx = i + 1;
                            /**
                             *
                             * @type {{sellerURL: string, isCreateInvoicePDF: boolean, isQualifiedInvoice: boolean, fileIdx: number, isCachePDF: boolean, invoiceId: string, sellerContactURL: string, qualifiedInvoiceReason: string}}
                             */
                            let copyParam = JSON.parse(JSON.stringify(invoiceListParam));
                            param.invoiceList.push(copyParam);
                            copyParam.fileIdx = idx;
                            try {
                                // PDF　URLが複数ある可能性があるので、リスト化する

                                exportUserLogMsg(`PDF情報${idx}番目の取得を開始します`)
                                pdfArrayBuffer = await getPDFArrayBuffer(pdfURL);
                                exportUserLogMsg(`PDF情報を取得しました`)
                                // // stringへ変換
                                let pdfStr = arrayBufferToStringSerializable(pdfArrayBuffer);
                                pdfStrs.push(pdfStr);

                                // 取得したPDFデータを解析
                                let decodeCheck = {
                                    type: `pdf-decode`
                                    , pdfStr
                                }
                                exportUserLogMsg(`PDF情報を解析します`)
                                /**
                                 * @type {{ type: string,invoiceId: string,isInvoice: boolean }}
                                 */
                                let pdfResult = await chrome.runtime.sendMessage(
                                    decodeCheck
                                )

                                copyParam.isQualifiedInvoice = pdfResult.isInvoice;//isInvoice;
                                param.isCreateInvoicePDF &= pdfResult.isInvoice;
                                param.isCreateInvoicePDF = Boolean(param.isCreateInvoicePDF)
                                copyParam.invoiceId = pdfResult.invoiceId
                                exportUserLogMsg(`PDF情報を解析が終了しました`)
                                if (pdfArrayBuffer) {
                                    if (isPdfGetAndDownload) {
                                        let number = idx > 1 ? `-${idx - 1}` : ""
                                        let exportFileName = `${fileName}${number}`
                                        downloadPDF(pdfArrayBuffer, exportFileName);
                                    }
                                } else {
                                    // 何らかのエラーでpdfArrayBufferが作れなかったので、エラーとして注文番号を注文番号を保持

                                }
                                console.log(pdfResult);
                            } catch (e) {
                                // PDF自体はあったが、制作過程で何らかのエラーが生じ作れなかった
                                exportUserLogMsg(`PDF情報取得時にエラーが発生し取得できませんでした。`)
                                copyParam.qualifiedInvoiceReason = "取得エラー";
                            }
                        }
                        exportUserLogMsg(`PDF情報をキャッシュします`)
                        let id = data.no

                        // PDF自体は作れてる
                        param.isCreateInvoicePDF = true;
                        param.qualifiedInvoiceReason = "作成";
                        let sendVal = {
                            ecName: AMAZON_EC_NAME,
                            orderNumber: data.no,
                            type: "set-ec-pdf-data",
                            pdfStrs,
                            fileName,
                            isInvoice,
                            param,
                            orderObj:data
                        };
                        chrome.runtime.sendMessage(sendVal, () => {
                            exportUserLogMsg(`[${id}]のPDF情報のキャッシュが完了しました`)
                        })

                    } else {
                        // param.isCachePDF = false
                        param.isCreateInvoicePDF = false
                        param.isQualifiedInvoice = false

                        // todo .pdfで終わるものが無かったので、ここはエラーを保持して警告出す
                        // A.発送や会計処理終わってないケース
                        // <a class="a-link-normal" hrclassNamegp/help/customer/display.html/ref=oh_aui_ajax_legal_invoice_help?ie=UTF8&amp;nodeId=201986650">
                        //             領収書／購入明細書がご利用になれません。くわしくはこちら。
                        //         </a>
                        invoiceLinkNode.querySelectorAll(`a`)
                        let target = Array.from(invoiceLinkNode.querySelectorAll("a"))
                            .find(a => a.textContent.indexOf("領収書／購入明細書がご利用になれません。") !== -1)
                        if (target) {
                            param.qualifiedInvoiceReason = `未発送・会計処理未済の注文もしくは、電子マネーの注文`
                        } else {
                            param.qualifiedInvoiceReason = `領収書の発行しか出来ず、適格請求書・支払い明細が取得できない注文`
                        }
                        exportUserLogMsg(`${param.qualifiedInvoiceReason}`)
                    }
                }

                resultOrderOutputs.push(createOrderOutputObject(data, param))

            }

            await _util_Thread__WEBPACK_IMPORTED_MODULE_3__.Thread.sleep(500);
            exportUserLogMsg(`${data.no}の処理が終了しました`)
        }

        // console.log(resultOrderOutputs);

        exportUserLogMsg(`デジタル${includeDigital ? "を含んだ" : "を含まない"}商品のデータ${list.length}件の処理が終了しました`)
        exportUserLogMsg(`結果ページを開きます。`)
        chrome.runtime.sendMessage(
            {type: "invoice-result", site: "Amazon", data: resultOrderOutputs}
        )
    }

    function exportUserLogMsg(msg) {
        viewLogger.log(msg)
    }

    function getInsertTarget() {
        return document.querySelector(`#controlsContainer,.page-tabs`)//,.js-yo-main-content`)
    }

    function isOrderPage() {
        return location.pathname.match('/gp/your-account/order-history')
            || location.pathname.match("/gp/css/order-history")
            || location.pathname.match(`/your-orders/orders`)
    }

    function nowLastYearList() {
        let years = document.querySelector(`#orderFilter,#time-filter`);
        if (!years) return [];
        let select = years.cloneNode(true);
        let filterd = select.querySelectorAll(`[value^="year-"]`)
        filterd.forEach(e => e.removeAttribute("selected"))
        return [filterd[0], filterd[1]];
    }

    function createControlFieldElem() {
        let tmp = document.createElement("div")
        let select = document.createElement("select");
        select.id = EXEC_YEAR_PRODUCT_LIST_ID
        select.innerHTML = `<option value="">選択してください</option>`;

        nowLastYearList().forEach(op => select.appendChild(op));
        select.value = "";
        let wrap = tmp.cloneNode();
        wrap.innerHTML = `<span>表示する年を選択：</span>`
        wrap.appendChild(select);
        let col = "#8effd9";
        let borCol = `#ccc`
        tmp.innerHTML = `
        <div style="padding-bottom: .5em;margin-bottom: .5em;border: solid 2px ${col};">
            <h3 style="padding: 3px;background-color: ${col};margin-bottom: 9px;border-bottom: solid 2px ${borCol};">ECダウンローダーコントロール</h3>
            <div style="padding: 6px 0;">
            <div style="display: flex;gap: .5em">
                <div>
                   ${wrap.innerHTML}
                </div>
                <button id="${EXEC_ELEMENT_ID}">
                ページに表示された注文情報のインボイスデータを作る
                </button>
                <div>
                <label><input type="checkbox" id="${INCLUDE_DIGITAL_CHOICE_ID}">デジタルを含める</label>
                </div>
                <div id="${PROGRESS_WRAP_ID}">
<!--                <label><input type="checkbox" id="${PDF_GET_AND_DOWNLOAD_CHOICE_ID}" checked="checked">PDF取得とダウンロードを同時に行う</label>-->
                </div>
            </div>
            <div style="border: inset 1px ${borCol};">
            <p style="margin: 0;border-bottom: solid 2px ">ログメッセージ:</p>
            <div id="${LOG_MESSAGE_FIELD}" style="padding:.25em; max-height: 3em;overflow-y: scroll;width: 100%;background-color: black;color: white">
            
            </div>
            </div>
            </div>
            <div id="${RESULT_FIELD}"></div>
        </div>
        `;

        return tmp.children[0];
    }

    function createOrders() {
        let orderNodes = Array.from(document.querySelectorAll(`.js-order-card`))
            .filter(e => !e.parentElement.classList.contains(`js-order-card`));
        /**
         *
         * @type {{date: string, invoiceData: {}, no: string, price: {total: string}, title: string}[]}
         */
        let list = []
        orderNodes.forEach(
            node => {
                let obj = createOrderObject(node);
                if (obj) list.push(obj)
            }
        )
        console.log(list);
        return list
    }

    function filterNonDigitalOrders() {
        return createOrders().filter(d => !d.isDigital)
    }

    function createOrderObject(node) {
        /**
         *
         * @type {{date: string, invoiceData: {}, no: string, isDigital: boolean, price: {total: string}, title: string}}
         */
        let orderObj = {
            no: ""
            , title: []
            , date: ""
            , price: {
                total: ""
            }
            , invoiceData: {}
            , isDigital: false
        }
        orderObj.no = node.querySelector(`.yohtmlc-order-id .value,.yohtmlc-order-id [dir="ltr"]`).textContent.trim()
        // todo 複数ある場合があるので先頭のみ、ただデータとしては取得する可能性あり
        // todo 商品リンクとASINは保持
        let linkNodes = Array.from(node.querySelectorAll("a[href]"))
            .filter(node => node.href.match(/\/[A-Z,0-9]{10}[/|?]/))
        let titles = linkNodes
            .filter(a => !a.querySelector("img"));
        let images = linkNodes
            .filter(a => a.querySelector("img"));
        //.querySelector(`.yohtmlc-item .a-link-normal,.yohtmlc-product-title`).textContent.trim()
        titles.forEach((titleLinkNode, index) => {
            //
            let asin = titleLinkNode.href.match(/\/[A-Z,0-9]{10}[/|?]/)[0]
                .replaceAll("/", "")
                .replaceAll("?", "");
            let href = titleLinkNode.href;
            let title = titleLinkNode.textContent;
            let imageWrapLinkNode = images[index];
            let img = imageWrapLinkNode.querySelector("img");
            let imgSrc = img.getAttribute("data-src") ?
                img.getAttribute("data-src") : img.getAttribute("src");
            orderObj.title.push(
                {asin, href, title, imgSrc}
            )

        })
        //
        orderObj.price.total = node.querySelector(`.yohtmlc-order-total .value,.yohtmlc-order-total`).textContent.trim()
        // ヘッダーの日付フォーマットを取得
        orderObj.date = Array.from(node.querySelectorAll(`.order-header span,.order-info span`)).find(e => e.textContent.trim().match(/[0-9]{4}年[0-9]{1,2}月[0-9]{1,2}日/))
            .textContent.trim()
        // キャンセルの場合、領収書等がでないのでその時点でnull返却
        try {

            orderObj.invoiceData = JSON.parse(
                Array.from(node.querySelectorAll(`.order-info .yohtmlc-order-level-connections [data-a-popover],.order-header .yohtmlc-order-level-connections [data-a-popover]`))
                    .filter(elem => ~elem.textContent.indexOf("領収書"))[0]
                    .getAttribute("data-a-popover"))
        } catch (e) {
            // エラーとなった注文番号は知りたいので、ログに出す
            exportUserLogMsg(`${orderObj.no}は領収書が有りません`)
            return null
        }
        orderObj.isDigital = Boolean(orderObj.no.match(/^D/))
        return orderObj;

    }

}


async function getPDFArrayBuffer(
    url = 'https://www.amazon.co.jp/documents/download/812ccde1-8a52-4f91-a4e3-8d0a9638bc56/invoice.pdf',
    options = {}
) {
    let res = await fetch(url);
    let arrayBuff = await res.arrayBuffer();
    return arrayBuff;
}


function arrayBufferToStringSerializable(arrayBuff) {

    const base64String = arrayBufferToBase64(arrayBuff);
    return base64String
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }

    return window.btoa(binary);
}

function arrayBuffSerializableStringToArrayBuff(str) {
    const newArrayBuffer = base64ToArrayBuffer(str);
    return newArrayBuffer;
}

function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
}

function downloadPDF(arrayBuffer, fileName) {

    // ここでnewArrayBufferを使用する
    const objectUrl = URL.createObjectURL(new Blob([arrayBuffer]));
    const objectLink = document.createElement('a');
    objectLink.href = objectUrl;
    objectLink.setAttribute('download', `${fileName}.pdf`);
    document.body.appendChild(objectLink);
    objectLink.click();
    URL.revokeObjectURL(objectLink.href);
    document.body.removeChild(objectLink);
    // objectLink.revokeObjectURL();
}

})();

/******/ })()
;