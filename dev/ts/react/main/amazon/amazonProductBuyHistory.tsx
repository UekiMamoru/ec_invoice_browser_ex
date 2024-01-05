import * as React from "react";
import {createRoot} from 'react-dom/client';
import {AmazonHistoryField} from "../../component/page/amazon/AmazonHistoryField";



if (isOrderPage()) {
    buildField();
}

function isOrderPage() {
    return location.pathname.match('/gp/your-account/order-history')
        || location.pathname.match("/gp/css/order-history")
        || location.pathname.match(`/your-orders/orders`)
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