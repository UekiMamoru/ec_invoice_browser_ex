import {ProductDataInserter} from "../view/ProductDataInserter";
import {GetAllProductUrlView} from "../view/GetAllProductUrlView";
import {Thread} from "../util/Thread";

export class TermProductDataInsertVM
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
        let firstUrlView = new GetAllProductUrlView();
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
            await Thread.sleep(300);
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
            getViews.push(new GetAllProductUrlView());
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