import {useParams} from "react-router-dom";

export const History = ()=>{
    const {id} = useParams();

    return(
        <div>{id}のヒストリだよ―</div>
    )
}
