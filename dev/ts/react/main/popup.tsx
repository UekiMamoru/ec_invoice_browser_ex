import * as React from "react";
import {createRoot} from 'react-dom/client';
import {EcHistoryLink} from "../component/page/popup/EcHistoryLink";
import OpenProps from "open-props";
import Colors from "open-props/src/props.colors.css"
import {FileFormatStorage} from "../../db/FileFormatStorage";
import {Suspense} from "react";
import {FileNameSuspenseModel, FileNameSuspenseResult} from "../../model/util/FileNameSuspenseModel";
import {HistoryResult} from "../../model/OrderHistoryDataModel";

// import {useState} from "react";
// import {FirebasePopupChromeAccountSingInV3} from "../../lib/FirebasePopupChromeAccountSingInV3";

const container = document.getElementById('app');
const fileNameSuspenseModel = new FileNameSuspenseModel();
const FileNameFormatField = () => {
    let data = ecResultCheck(getFileFormat())
    let format = data?.format;
    let defaultData = data?.default;
    if (!format) {
        format = defaultData?.viewName;
    }
    let optionOpen = () => {

        let url = chrome.runtime.getURL(`option/index.html?target=user&ec=setting`);
        chrome.tabs.create({url})

    }

    return (
        <div style={{position: "fixed", left: "0", bottom: "0", width: "100%", backgroundColor: "#ffa559"}}>
            <div style={{
                padding: ".5em",
                borderBottom: "solid 1px #ccc",
                borderTop: "solid 1px #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
            }}>
                <p style={{fontSize: "1em"}}>現在のファイルネームフォーマット</p>
                <button onClick={optionOpen} style={{fontSize: "1em"}}>編集</button>
            </div>
            <div style={{
                fontWeight: "bold",
                padding: ".5em",
                border: "solid 1px #ccc",
                backgroundColor: "white"
            }}>{format}.pdf
            </div>
        </div>);

}
const getFileFormat = () => {
    return fileNameSuspenseModel.getFormat("format");
}

function ecResultCheck(ecResult: FileNameSuspenseResult) {
    if (ecResult.status) {
        return ecResult.data;
    }
    throw ecResult.promise;
}

const App = () => {
    let siteName = "amazon";
    // let [credential, setCredential] = useState("");
    // const signIn = (event: React.MouseEvent<HTMLButtonElement>) => {
    //     let target = event.currentTarget;
    //     target.disabled = true;
    //     let reader = `...`
    //     let v = setInterval(() => {
    //         if (reader.length > 3) {
    //             reader += ".";
    //         }
    //         setCredential(`現在取得中${reader}`)
    //     }, 50)
    //     let key = {
    //         apiKey: "AIzaSyBnVUxAa-FsFpnC9wik1p1Lw0k-y--18S0",
    //         authDomain: "chrome-ex-login-test.firebaseapp.com",
    //         projectId: "chrome-ex-login-test",
    //         storageBucket: "chrome-ex-login-test.appspot.com",
    //         messagingSenderId: "1058695333901",
    //         appId: "1:1058695333901:web:e0709d8cff1396001ced44",
    //         measurementId: "G-1MYM0FMJX5"
    //     }
    //
    //     let v3 = new FirebasePopupChromeAccountSingInV3();
    //     v3.signInWithCredential(key).then(result => {
    //         clearInterval(v)
    //         setCredential(`ユーザID:${result.user?.uid}`)
    //     }).catch(er => {
    //         clearInterval(v)
    //         setCredential("取得に失敗しました。")
    //     }).finally(() => {
    //         target.disabled = false;
    //
    //     })
    // };

    return (
        <>
            {/*<p>サインイン</p>*/}
            {/*<button onClick={signIn}>Googleで登録して利用を開始</button>*/}
            {/*<p>{credential}</p>*/}
            <div style={{paddingBottom:"3em"}}>
                <button className={"btn"}><a href="https://www.amazon.co.jp/gp/your-account/order-history"
                                             target="_blank">Amazonの注文履歴を開く</a></button>
                <EcHistoryLink siteName={siteName}/>
                <div>
                    <Suspense fallback={<p>ロード中</p>}>
                        <FileNameFormatField/>
                    </Suspense>
                </div>
                <div style={{paddingTop:".5em",marginTop:".5em",fontSize:".95rem",borderTop:"2px solid #ccc"}}>
                    <a href="https://forms.gle/8V5PJADY2Jio4Lb69" target="_blank">GoogleFormでお問い合わせ</a>
                </div>

            </div>
        </>
    )
};


const root = createRoot(container!)
root.render(<App/>);
