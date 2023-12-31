import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Home} from "../Home";
import NavBar from "../navigation/NavBar";
import {EcInvoiceHistory} from "../../../../main/EcInvoiceHistory";
import header from "../../../../../../css/header.module.scss"
import {useEffect} from "react";

export const OptionRoute = () => {
    let title = chrome.runtime.getManifest().name;
    return (

        <BrowserRouter basename="/option">
            <header className={header.header}>
                <div className={header.field}>

                    <div>{title}</div>
                    <NavBar/>
                </div>
            </header>
            <Routes>
                <Route path="/index.html" element={<Home/>}/>
                <Route path="/history/:id" element={<EcInvoiceHistory/>}/>
            </Routes>
        </BrowserRouter>
    )
}