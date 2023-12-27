import {initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getAuth, GoogleAuthProvider, signInWithCredential} from 'firebase/auth'
import {UserCredential} from "@firebase/auth";

export class FirebasePopupChromeAccountSingInV3 {
    private _conf: { [key: string]: any } = {};

    constructor() {
    }

    set config(_: {}) {
        this._conf = _;
    }

    validateConf(config: { [key: string]: any }) {
        let conf = config
        const requireKeys = ["apiKey", "authDomain", "projectId", "storageBucket", "messagingSenderId", "appId", "measurementId"];
        const notHaveRequireKeys: string[] = [];
        const noValueKeys: string[] = [];
        requireKeys.forEach((key: string) => {
            if (conf.hasOwnProperty(key)) {
                if (!conf[key]) {
                    noValueKeys.push(key);
                }
            } else {
                notHaveRequireKeys.push(key);
            }
        });
        if (noValueKeys.length === 0 && notHaveRequireKeys.length === 0) {
            return true;
        }
        let errorMsg = "";
        if (notHaveRequireKeys.length) {
            errorMsg = `Required keys are missing: ${notHaveRequireKeys.join(", ")}\n`;
        }
        if (noValueKeys.length) {
            errorMsg += `No value keys are missing: ${noValueKeys.join(", ")} `;
        }
        throw new Error(errorMsg);
    }

    async signInWithCredential(config: { [key: string]: any }): Promise<UserCredential> {
        this.validateConf(config);
        let firebaseConfig = config;
// Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const analytics = getAnalytics(app);

        console.log(app)
        console.log(analytics)

        initializeApp(firebaseConfig)
        const auth = getAuth();


// ChromeアプリからGoogleログインしてトークン取得
        let result: chrome.identity.GetAuthTokenResult = await chrome.identity.getAuthToken(
            {interactive: true})
        let token = result.token;
        console.log('token', token)
        // Googleログイン成功時に受け取るトークンを使ってGoogleのクレデンシャル作成
        const credential = GoogleAuthProvider.credential(null, token)
        console.log('credential:', credential)
        console.log('auth:', auth)

        // Googleユーザーのクレデンシャルを使ってサインイン

        let credentialResult: UserCredential;

        credentialResult = await signInWithCredential(auth, credential);
        return credentialResult;

    }
}