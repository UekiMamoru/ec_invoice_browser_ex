import {JSX, ReactEventHandler, useEffect, useState} from "react";
import {CreateInvoice} from "./CreateInvoice";
import {ViewLogger} from "../../view/ViewLogger";
import {LoaderEffect} from "../../util/LoaderEffect";
import {TermProductDataInsertVM} from "../../vm/TermProductDataInsertVM";
import {ProductDataInserter} from "../../view/ProductDataInserter";
import {LoaderField} from "../../../../model/LoaderField";

const cache: { [key: string]: { target: string, data: Element[][], lastIndex: number } } = {};
const loaderField = new LoaderField();
const viewLogger = new ViewLogger();
viewLogger.field = loaderField.msgBox;
export const InvoiceControlFieldBody = () => {
    let optionList = nowLastYearList();
    let options = optionElementToJSXElement(optionList);
    let [disabled, setDisabled] = useState(false);
    let [selectValue, setSelectValue] = useState("")


    useEffect(() => {

        if (!selectValue) {
            disabledChange(false);
            return
        }
        ;
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
            <div style={{padding: ".5em"}}>
                <div style={{display: "flex", gap: "1.5em", alignItems: "center"}}>
                    <div>

                        <span>表示する年を選択： </span>
                        <select defaultValue={selectValue} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                            disabledChange(true);
                            setSelectValue(e.currentTarget.value);
                            change(e).then(e => {

                            }).finally(() => {
                                disabledChange(false);
                            });
                        }} disabled={disabled}>
                            {options}
                        </select>
                    </div>
                    <CreateInvoice callback={disabledChange} getState={getState}/>
                </div>
                <div>
                    <p style={{color: "red", fontSize: ".85em", fontWeight: "bold", padding: ".5em"}}>
                        当拡張機能はアマゾンアカウント情報は取得していません。<br/>
                        そのため、履歴データとアマゾンアカウントの情報紐づけを行いません。<br/>
                        複数のアマゾンアカウントで情報を収集しますと履歴が混在します。ご了承ください。<br/>
                        履歴データを取得済みの場合、拡張機能のアイコンをクリックで開くウィンドから履歴の削除ができます。
                    </p>

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

async function change(e: React.ChangeEvent<HTMLSelectElement>) {
    let selectElement = e.currentTarget;
    if (selectElement.value) {
        let year = selectElement.value;
        year = year.trim().replaceAll(/[^0-9]/ig, "");
        try {
            let pagi = document.querySelector(".a-pagination");
            if (pagi instanceof HTMLElement) {
                pagi.style.display = "none";
            }
        } catch (e) {

        }
        loaderField.show();
        viewLogger.field = loaderField.msgBox;
        let vm = new TermProductDataInsertVM();
        vm.year = year;
        vm.inserter = new ProductDataInserter();
        // ページネーション
        vm.logger = viewLogger
        vm.progress = new LoaderEffect(getProgressElement());
        vm.resultElement = getResultElement();//document.querySelector(`#${RESULT_FIELD}`)
        if (cache[year]) {
            vm.execDraw(cache[year])
        } else {
            // 非表示
            try {
                let element =
                    document.querySelector(`form[action="/your-orders/orders"]`)
                if (element instanceof HTMLElement) {
                    element.style.display = "none";
                }
            } catch (e) {

            }

            let result: { target: string, data: Element[][], lastIndex: number } = await vm.exec();
            cache[year] = result;
        }
        loaderField.hide();

    }
}

function getProgressElement() {
    return document.createElement("progress")
}

function getResultElement() {
    return document.createElement("div");
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
        // 初年度の場合、1件しかない場合があるので判定をちゃんと入れる
        return filterd.splice(0,2);///[filterd[0], filterd[1]]
    }
    return []
}