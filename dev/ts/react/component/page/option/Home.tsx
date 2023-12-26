import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {useEffect} from "react";
import {EcInvoiceHistory} from "../../../main/EcInvoiceHistory";

export const Home = ()=>{

    return(
        <QueryHandler/>
    )
}
function QueryHandler() {
    // const location = useLocation();
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    useEffect(() => {
        const target = searchParams.get('target');
        const ec = searchParams.get('ec');
        if (target && ec) {
            // URLを書き換えるが、リダイレクトはしない
            navigate(`/${target}/${ec}`, { replace: true });
        }
    }, [location, history]);

    // URLに基づいて表示するコンポーネントを決定
    if (location.pathname.startsWith('/history/')) {
        return <EcInvoiceHistory />;
    }

    // デフォルトのホーム画面など、他のコンポーネントをここに表示
    return <div>ホームだよー</div>;
}

