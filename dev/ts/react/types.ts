
export type AmazonOrderProductData ={ asin: string, href: string, title: string, imgSrc: string }
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
    invoiceList:AmazonInvoiceDataParamObj[],
}


export type CombinePDFData={
    orderNumber:string,
    index:string
}