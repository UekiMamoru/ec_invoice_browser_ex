import {CtrlLock} from "./CtrlLock";

export class AmazonHistoryCtrlLock extends CtrlLock
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