import * as React from "react";
import {OptionIndex} from "../component/page/option/OptionIndex";
import {createRoot} from "react-dom/client";
import {OptionRoute} from "../component/page/option/route/OptionRoute";

const container = document.getElementById('app');

const App = () => {


    return (
        <>
            <OptionIndex/>

        </>)
};


const root = createRoot(container!);// if you use TypeScript
root.render(<App/>);