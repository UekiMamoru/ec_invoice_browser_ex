import * as React from "react";
import {createRoot} from 'react-dom/client';
import {EcHistoryLink} from "../component/page/popup/EcHistoryLink";
import { useState} from "react";
import {FirebasePopupChromeAccountSingInV3} from "../../lib/FirebasePopupChromeAccountSingInV3";

const container = document.getElementById('app');

const App = () => {
    let siteName = "amazon"
    let [credential, setCredential] = useState("");
    const signIn = (event:React.MouseEvent<HTMLButtonElement>) => {
        let target =event.currentTarget;
        target.disabled = true;
        let reader = `...`
        let v = setInterval(()=>{
            if(reader.length>3){
                reader+=".";
            }
            setCredential(`現在取得中${reader}`)
        },50)
        let key = {
            apiKey: "AIzaSyBnVUxAa-FsFpnC9wik1p1Lw0k-y--18S0",
            authDomain: "chrome-ex-login-test.firebaseapp.com",
            projectId: "chrome-ex-login-test",
            storageBucket: "chrome-ex-login-test.appspot.com",
            messagingSenderId: "1058695333901",
            appId: "1:1058695333901:web:e0709d8cff1396001ced44",
            measurementId: "G-1MYM0FMJX5"
        }

        let v3 = new FirebasePopupChromeAccountSingInV3();
        v3.signInWithCredential(key).then(result => {
            clearInterval(v)
            setCredential(`ユーザID:${result.user?.uid}`)
        }).catch(er=>{
            clearInterval(v)
            setCredential("取得に失敗しました。")
        }).finally(()=>{
            target.disabled = false;

        })
    };

    return (
        <>
            <p>サインイン</p>
            <button onClick={signIn}>Googleで登録して利用を開始</button>
            <p>{credential}</p>
            <button><a href="https://www.amazon.co.jp/gp/your-account/order-history"
                       target="_blank">Amazonの注文履歴を開く</a></button>
            <EcHistoryLink siteName={siteName}/>
        </>
    )
};


const root = createRoot(container!)
root.render(<App/>);