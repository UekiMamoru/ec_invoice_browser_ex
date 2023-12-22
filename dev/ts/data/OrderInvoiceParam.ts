export class OrderInvoiceParam {
    private _fileIdx: number;
    private _invoiceId: string;
    private _isCachePDF:
        boolean;
    private _isCreateInvoicePDF:
        boolean;
    private _isQualifiedInvoice:
        boolean;
    private _qualifiedInvoiceReason:
        string;
    private _sellerContactURL:
        string;
    private _sellerURL:
        string;


    get fileIdx(): number {
        return this._fileIdx;
    }

    set fileIdx(value: number) {
        this._fileIdx = value;
    }

    get invoiceId(): string {
        return this._invoiceId;
    }

    set invoiceId(value: string) {
        this._invoiceId = value;
    }

    get isCachePDF(): boolean {
        return this._isCachePDF;
    }

    set isCachePDF(value: boolean) {
        this._isCachePDF = value;
    }

    get isCreateInvoicePDF(): boolean {
        return this._isCreateInvoicePDF;
    }

    set isCreateInvoicePDF(value: boolean) {
        this._isCreateInvoicePDF = value;
    }

    get isQualifiedInvoice(): boolean {
        return this._isQualifiedInvoice;
    }

    set isQualifiedInvoice(value: boolean) {
        this._isQualifiedInvoice = value;
    }

    get qualifiedInvoiceReason(): string {
        return this._qualifiedInvoiceReason;
    }

    set qualifiedInvoiceReason(value: string) {
        this._qualifiedInvoiceReason = value;
    }

    get sellerContactURL(): string {
        return this._sellerContactURL;
    }

    set sellerContactURL(value: string) {
        this._sellerContactURL = value;
    }

    get sellerURL(): string {
        return this._sellerURL;
    }

    set sellerURL(value: string) {
        this._sellerURL = value;
    }
}