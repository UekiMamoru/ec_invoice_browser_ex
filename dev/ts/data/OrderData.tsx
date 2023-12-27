import {ProductData} from "./ProductData";
import {OrderInvoiceParam} from "./OrderInvoiceParam";

export class OrderData {

    private _orderNumber: number = 0;
    private _date: string ="";
    private _price: string="";
    private _isDigital: boolean = false;
    private _productDataList: ProductData[]=[];
    private _isMultipleOrder: boolean = false;
    private _isQualifiedInvoice: boolean = false;
    private _isCreateInvoicePDF: boolean = false;
    private _qualifiedInvoiceReason: string="";
    private _sellerContactURLs: string[]=[];
    private _invoiceId: string="";
    private _sellerURL: string="";
    private _sellerURLs: string[]=[];
    private _isCachePDF: boolean=false;
    private _invoiceList: OrderInvoiceParam[]=[];


    get orderNumber(): number {
        return this._orderNumber;
    }

    set orderNumber(value: number) {
        this._orderNumber = value;
    }

    get date(): string {
        return this._date;
    }

    set date(value: string) {
        this._date = value;
    }

    get price(): string {
        return this._price;
    }

    set price(value: string) {
        this._price = value;
    }

    get isDigital(): boolean {
        return this._isDigital;
    }

    set isDigital(value: boolean) {
        this._isDigital = value;
    }

    get productDataList(): ProductData[] {
        return this._productDataList;
    }

    set productDataList(value: ProductData[]) {
        this._productDataList = value;
    }

    get isMultipleOrder(): boolean {
        return this._isMultipleOrder;
    }

    set isMultipleOrder(value: boolean) {
        this._isMultipleOrder = value;
    }

    get isQualifiedInvoice(): boolean {
        return this._isQualifiedInvoice;
    }

    set isQualifiedInvoice(value: boolean) {
        this._isQualifiedInvoice = value;
    }

    get isCreateInvoicePDF(): boolean {
        return this._isCreateInvoicePDF;
    }

    set isCreateInvoicePDF(value: boolean) {
        this._isCreateInvoicePDF = value;
    }

    get qualifiedInvoiceReason(): string {
        return this._qualifiedInvoiceReason;
    }

    set qualifiedInvoiceReason(value: string) {
        this._qualifiedInvoiceReason = value;
    }

    get sellerContactURLs(): string[] {
        return this._sellerContactURLs;
    }

    set sellerContactURLs(value: string[]) {
        this._sellerContactURLs = value;
    }

    get invoiceId(): string {
        return this._invoiceId;
    }

    set invoiceId(value: string) {
        this._invoiceId = value;
    }

    get sellerURL(): string {
        return this._sellerURL;
    }

    set sellerURL(value: string) {
        this._sellerURL = value;
    }

    get sellerURLs(): string[] {
        return this._sellerURLs;
    }

    set sellerURLs(value: string[]) {
        this._sellerURLs = value;
    }

    get isCachePDF(): boolean {
        return this._isCachePDF;
    }

    set isCachePDF(value: boolean) {
        this._isCachePDF = value;
    }

    get invoiceList(): OrderInvoiceParam[] {
        return this._invoiceList;
    }

    set invoiceList(value: OrderInvoiceParam[]) {
        this._invoiceList = value;
    }
}