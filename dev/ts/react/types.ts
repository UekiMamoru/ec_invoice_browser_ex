export type AmazonOrderProductData = { asin: string, href: string, title: string, imgSrc: string }
export type AmazonOrderDataObj = {
    no: string,
    productList: AmazonOrderProductData[],
    date: string,
    price: { total: string },
    invoiceData: { url: string },
    isDigital: boolean
};
export type AmazonInvoiceObj = {
    isQualifiedInvoice: boolean,
    isCreateInvoicePDF: boolean,
    qualifiedInvoiceReason: string,
    sellerContactURLs: string[],
    invoiceList: AmazonInvoiceDataParamObj[],
}
export type AmazonInvoiceDataParamObj = {
    isQualifiedInvoice: boolean,
    isCreateInvoicePDF: boolean,
    qualifiedInvoiceReason: string,
    sellerContactURL: string,
    sellerURL: string,
    isCachePDF: false,
    invoiceId: string,
    fileIdx: number
}


export type AmazonResultTransferObject = {

    orderNumber: string,
    date: string,
    price: string,
    isDigital: boolean,
    productDataList: AmazonOrderProductData[],
    isMultipleOrder: boolean,
    isQualifiedInvoice: boolean,
    isCreateInvoicePDF: boolean,
    qualifiedInvoiceReason: string,
    sellerContactURLs: string[],
    invoiceList: AmazonInvoiceDataParamObj[],
}


export type CombinePDFData = {
    orderNumber: string,
    index: string
}

export type FileNameTypeObj = { name: string, format: string, viewName: string }
export type FileNameFormatObj = {
    format: string,
    formats: string[],
    default: FileNameTypeObj,
    option: {
        orderDate: FileNameTypeObj,
        orderNum: FileNameTypeObj,
        siteName: FileNameTypeObj
    },
    custom?:FileNameTypeObj[],
    dateSeparator:number,
    dateZeroPadding:number
}

export const DATE_SEPARATOR_FORMAT_TYPE = {
    HYPHEN:0,
    SLASH:1,
    UNDER_SCORE:3,
    JP_YYYYMMDD:2
} as const;


export const DATE_ZERO_PADDING_FORMAT_TYPE = {
    PADDING:0,
    NO_PADDING:1
} as const;


export type FileNameExportData = {
    siteName:string,
    orderNumber:string,
    date:string
}


export type ChildToParentSenderData = {
    sender:Function,
    boolVal?:boolean
    strVal?:string
    numberVal?:number
}


export type ZipTempData ={
    fileName:string,
    data:ArrayBufferLike
}