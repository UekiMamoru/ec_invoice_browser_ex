import * as React from "react";
import {createRoot} from 'react-dom/client';
import {AmazonHistoryField} from "../../component/page/amazon/AmazonHistoryField";



if (isOrderPage()) {
    buildField();
}

function isOrderPage() {
    return location.pathname.match(`/your-orders/orders`)
    || location.pathname.match(/\/gp\/([a-z,0-9,-]|_)+\/order-history/)
}

function buildField() {

    const container = document.createElement('div');
    const insertField = getInsertTarget();
    if (!insertField) {
        return
    }
    const App = () => {
        return (
            <>
                <AmazonHistoryField/>
            </>)
    }
    insertField.appendChild(container)
    const root = createRoot(container)
    root.render(<App/>);
}

function getInsertTarget() {
    return document.querySelector(`#controlsContainer,.page-tabs`)//,.js-yo-main-content`)
}