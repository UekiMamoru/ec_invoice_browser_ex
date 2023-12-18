export class LoaderEffect
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