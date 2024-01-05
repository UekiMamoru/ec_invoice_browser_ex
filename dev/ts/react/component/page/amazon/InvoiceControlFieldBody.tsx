import {JSX, ReactEventHandler, useEffect, useState} from "react";
import {CreateInvoice} from "./CreateInvoice";

export const InvoiceControlFieldBody = () => {
    let optionList = nowLastYearList();
    let options = optionElementToJSXElement(optionList);
    let [disabled, setDisabled] = useState(false);
    let [selectValue, setSelectValue] = useState("");


    useEffect(() => {

        if (!selectValue) {
            disabledChange(false);
            return
        };
        setTimeout(() => {
            disabledChange(false);
        }, 1000)
        // valueがあったら、その内容で取得する
        console.debug(selectValue);
    }, [selectValue])
    const disabledChange = (changed: boolean) => {
        setDisabled(changed)
    }
    const getState = () => disabled;
    const getSelectValue = () => selectValue;
    return (
        <>
            <div>
                <div>
                    <span>表示する年を選択：</span>
                    <select defaultValue={selectValue} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                        disabledChange(true);
                        setSelectValue(e.currentTarget.value);
                        change(e);
                    }} disabled={disabled}>
                        {options}
                    </select>
                    <CreateInvoice callback={disabledChange} getState={getState}/>
                </div>
                <div>

                </div>
            </div>
        </>
    )
}

function createInvoiceData() {

}

function optionElementToJSXElement(optionList: HTMLOptionElement[]): JSX.Element {
    return (<>
        <option value="">選択してください</option>
        {optionList.map(((op, index) => {
            return <option value={op.value} key={index}>{op.textContent}</option>
        }))}</>)
}

function change(e: React.ChangeEvent<HTMLSelectElement>) {
    let selectElement = e.currentTarget;
    if (selectElement.value) {

    }
}

/**
 *
 */
function nowLastYearList() {
    let years = document.querySelector(`#orderFilter,#time-filter`);
    if (!years) return [];
    let clone = years.cloneNode(true);
    if (clone instanceof HTMLSelectElement) {
        let select = clone;
        let filterd: HTMLOptionElement[] = [];
        let nodeList = Array.from(select.querySelectorAll(`option[value^="year-"]`));
        nodeList.forEach(node => {
            if (node instanceof HTMLOptionElement) {
                let option: HTMLOptionElement = node;
                filterd.push(option)
            }
        });
        for (const e of filterd) {
            e.removeAttribute("selected");
        }
        return [filterd[0], filterd[1]]
    }
    return []
}