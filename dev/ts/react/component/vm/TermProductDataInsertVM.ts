import {ProductDataInserter} from "../view/ProductDataInserter";
import {LoaderEffect} from "../util/LoaderEffect";
import {ViewLogger} from "../view/ViewLogger";
import {GetAllProductUrlView} from "../view/GetAllProductUrlView";
import {Thread} from "../util/Thread";

export class TermProductDataInsertVM {
    /**
     * @type {ProductDataInserter}
     */
    private _inserter!: ProductDataInserter;

    private _year = "";

    private _lastIndex = 0;


    /**
     *
     * @type {ViewLogger}
     * @private
     */
    private _logger!: ViewLogger;


    /**
     *
     * @type {LoaderEffect}
     * @private
     */
    private _progress: LoaderEffect;
    /**
     *
     * @type {HTMLElement}
     * @private
     */
    private _resultElement!: HTMLElement;

    constructor() {
        this._progress = new LoaderEffect(document.createElement("progress"))
    }


    set resultElement(_: HTMLElement) {
        this._resultElement = _;
    }

    set logger(value: ViewLogger) {
        this._logger = value;
    }

    get inserter() {
        return this._inserter;
    }

    set inserter(value: ProductDataInserter) {
        this._inserter = value;
    }

    get year() {
        return this._year;
    }

    set year(value: string) {
        this._year = value;
    }

    get lastIndex() {
        return this._lastIndex;
    }

    set lastIndex(value: number) {
        this._lastIndex = value;
    }


    get progress() {
        return this._progress;
    }

    set progress(value: LoaderEffect) {
        this._progress = value;
    }


    /**
     *
     */
    execDraw(cacheData: { target: string, data: Element[][], lastIndex: number }) {
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
        this.result(cacheData.target, cacheData.data);
        return;
    }

    /**
     *
     * @return {Promise<{target:number,data:Element[],lastIndex:number}>}
     */
    async exec():Promise<{target:string,data:Element[][],lastIndex:number}> {
        let inserter = this._inserter;
        let logger = this._logger;
        let cacheNodes: Element[][] = [];
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
            = await firstUrlView.exec();

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
            let temp: GetAllProductUrlView[] = [];
            // 3の倍数かどうかはわからないので、無かったら落とす
            getViews.forEach((view, index) => {
                let url = urls[i + index];
                if (url) {
                    view.src = urls[i + index];
                    temp.push(view);
                }
            });
            let promises: Promise<{ productNodes: Element[], lastIndex: number }>[] = [];
            temp.forEach(v => {
                promises.push(v.exec())
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
        this.result(year, cacheNodes);
        return {target: (this._year), data: cacheNodes, lastIndex: this._lastIndex}
    }

    result(year: string, nodesList: Element[][] = []) {
        let size = 0;
        nodesList.forEach((list) => {
            size += list.length
        })
        this._resultElement.innerHTML = `${year}年は${size}件注文がありました(非表示要素は含まれません)。`;
    }

    createGetViews(createCount: number): GetAllProductUrlView[] {
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

    accessURL(param: { [key: string]: string } = {}) {
        let base = `/gp/your-account/order-history`;
        let queryList: string[] = []
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