export class ViewLogger
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
        msgP.style.paddingBottom = ".15em"
        this._field.prepend(msgP)
    }
}