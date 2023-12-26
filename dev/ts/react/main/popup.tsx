import * as React from "react";
import {SiteHistoryPageTitle} from "../component/page/SiteHistoryPageTitle";

import {createRoot} from 'react-dom/client';
import {SiteHistoryResult} from "../component/page/SiteHistoryResult";
import {EcHistoryLink} from "../component/page/popup/EcHistoryLink";

const container = document.getElementById('app');
import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getAuth, GoogleAuthProvider, signInWithCredential} from 'firebase/auth'

const App = () => {
    let siteName = "amazon"
    const firebaseConfig = {
    }
// Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);

    console.log(app)
    console.log(analytics)

    initializeApp(firebaseConfig)
    const auth = getAuth()

// ChromeアプリからGoogleログインしてトークン取得
    chrome.identity.getAuthToken(
        {interactive: true}).then(
        (result: chrome.identity.GetAuthTokenResult) => {
            let token = result.token;
            console.log('token', token)
            // Googleログイン成功時に受け取るトークンを使ってGoogleのクレデンシャル作成
            const credential = GoogleAuthProvider.credential(null, token)
            console.log('credential:', credential)
            console.log('auth:', auth)

            // Googleユーザーのクレデンシャルを使ってサインイン
            signInWithCredential(auth, credential).then((result: any) => {
                console.log("Sign In Success", result)
            }).catch((error: any) => {
                console.log("Sign In Error", error)
            })
        }
    )
    return (
        <>
            <button><a href="https://www.amazon.co.jp/gp/your-account/order-history"
                       target="_blank">Amazonの注文履歴を開く</a></button>
            <EcHistoryLink siteName={siteName}/>
        </>
    )
};


const root = createRoot(container!);// if you use TypeScript
root.render(<App/>);