import {BrowserRouter,Route,Routes} from "react-router-dom";
import {Home} from "../Home";
import {History} from "../History";
import {NotFound} from "../NotFound";
import NavBar from "../navigation/NavBar";


export const OptionRoute=()=>{
    return (
        <BrowserRouter>
            <NavBar/>
            <Routes>
                <Route path="/option/index.html" element={<Home/>}/>
                <Route path="/option/history/:id" element={<History/>}/>
            </Routes>
        </BrowserRouter>
    )
}