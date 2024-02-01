import {Logger} from "../lib/Logger";

export class ViewLogger extends Logger {

    private _field: HTMLElement;

    constructor() {
        super()
        /**
         *
         * @type {HTMLElement}
         * @private
         */
        this._field = document.createElement("div");
    }

    set field(_: HTMLElement) {
        this._field = _
    }

    log(msg: string) {
        let msgP = document.createElement("p")
        msgP.innerHTML = msg;
        msgP.style.margin = "0";
        msgP.style.paddingBottom = ".15em";
        msgP.style.color = "white";
        msgP.style.fontSize = "12px";
        this._field.prepend(msgP);
    }
}