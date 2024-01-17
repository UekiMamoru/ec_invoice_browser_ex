export class LoaderEffect {
    private _start = 0;
    private _end = 10;
    private _progressElement!:HTMLProgressElement ;
    constructor(_progressElement:HTMLProgressElement) {
        /**
         * @type HTMLProgressElement
         * @private
         */
        this._progressElement = _progressElement;
    }


    start(_last:number) {
        this._end = _last;
        this._progressElement.max = this._end;
    }



    get end(): number {
        return this._end;
    }

    set end(value: number) {
        this._end = value;
    }

    show() {
        this._progressElement!.style.display = "block"
    }

    hide() {
        this._progressElement!.style.display = "none"
    }


    stop() {
    }

    flush() {
    }

    update(_:number) {
        this._progressElement.value = _;
    }

}