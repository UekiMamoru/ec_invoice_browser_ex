import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

const FUNCTION_KEY = {
    F5: "F5",
} as const;
type FunctionKey = (typeof FUNCTION_KEY)[keyof typeof FUNCTION_KEY];

export const ReloadRewriter = () => {

    const navigate = useNavigate();
    useEffect(() => {
        document.body.addEventListener("keydown", rewriteEvent);
        return () => document.body.removeEventListener("keydown", rewriteEvent);
    }, []);
    let rewriteEvent = (event: KeyboardEvent) => {
        let code = event.code + "";
        switch (code) {
            case FUNCTION_KEY.F5:
                return rewrite(event);
            default:
        }
        if (event.ctrlKey) {
            switch (code) {
                case "KeyR":
                    return rewrite(event);
            }
        }
    }
    let rewrite = (event: KeyboardEvent) => {

        console.log(event.code);
        // GetQueryがあるならリロードを許可>別でリダイレクト
        if (location.search) {
            return "";
        }
        if (location.pathname === "/option/index.html") {
            return ""
        }
        // GetQueryが無く、/option/index.htmlではないなら、強制的にindex.html?queryの形にする
        let paths = location.pathname.split("/");
        let query = [`${paths.pop()}`, `${paths.pop()}`].reverse().join("/")
        // let redirectParam = `/index.html?${query}`
        navigate(`/${query}`);
        event.preventDefault();
        // 同じINDEXに飛ばす
        // topなら何もしない
        return "";
    }
    return (
        <></>
    )
}