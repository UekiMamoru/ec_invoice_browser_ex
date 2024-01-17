import {AmazonOrderProductData} from "../../../../types";
type ProductDataWrapObj = {
    productData:AmazonOrderProductData
}
export const HistoryProductDataLink =(prop:ProductDataWrapObj)=>{

    let {productData} = prop;
    return (
        <div style={{display:"flex",gap: "3px"}}>
            <div style={{width: "48px",height: "auto"}}>
                <img src={productData.imgSrc} style={{width: "auto",maxWidth: "100%",height: "auto"}} /></div>
            <div style={{maxWidth: "10em",maxHeight: "4.5em",overflow: "hidden"}}>
                <a href={productData.href} target="_blank">[{productData.asin}]{productData.title}</a>
            </div>
        </div>
    )
}
/**
 *
 * @param productData{   {asin:string, href:string, title:string, imgSrc:string}}
 */
function productDataLink(productData: AmazonOrderProductData) {



}