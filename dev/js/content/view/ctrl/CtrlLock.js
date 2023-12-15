export class CtrlLock
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