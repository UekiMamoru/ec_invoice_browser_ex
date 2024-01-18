export class LoaderField {
    private _field: HTMLDivElement;
    private _msgBoxId: string = "invoiceLoaderLog";
    private _fieldId: string = "invoiceLoaderField";
    private _msgBox: HTMLDivElement;
    private _fieldHideClazzName = "invoiceLoaderField--hide"

    constructor() {
        this._msgBox = document.createElement("div");
        this._field = this.getField();
    }

    get msgBox() {
        return this._msgBox;
    }


    show() {
        this._field.classList.remove(this._fieldHideClazzName);
    }

    hide() {
        this._field.classList.add(this._fieldHideClazzName);
    }

    flashMsg() {
        this._msgBox.innerHTML = "";
    }

    private getField() {
        let target = document.querySelector(`#${this._fieldId}`)
        if (target && target instanceof HTMLDivElement) {
            this._field = target;
        } else {
            this._field = document.createElement("div");
            this._field.id = this._fieldId;
            this._field.classList.add("invoiceLoaderField");
            this._field.classList.add(this._fieldHideClazzName)
            this._field.innerHTML = this.createFieldHTMLStr();
            document.body.appendChild(this._field)
        }
        let t = this._field.querySelector(`div#${this._msgBoxId}`);
        if (t instanceof HTMLDivElement) {
            this._msgBox = t;
        }
        return this._field;

    }

    private createFieldHTMLStr() {
        return `
            <div class="invoiceLoaderField__bk"></div>
            <div class="invoiceLoaderField__wrap">
                <div class="invoiceLoaderField__header"></div>
                <div class="invoiceLoaderField__body">
                    <div class="invoiceLoaderField__loader"><div class="loader"></div></div>
                </div>
                <div class="invoiceLoaderField__footer">
                    <div class="invoiceLoaderField__msgBox" id="${this._msgBoxId}"></div>
                </div>
            </div>
        
        `;
    }
}