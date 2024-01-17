export class ViewLogger {
    private _field!: HTMLElement;

    constructor() {
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