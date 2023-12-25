import {NavLink} from "react-router-dom";
type NavProp ={name:string,to:string}

const NavBar = () => {
    return (
        <nav>
            <ul>
                <li>
                    <OptionNavLink name={"TOP"} to={"/option/index.html"}/>
                </li>
                <li>
                    <OptionNavLink name={"Amazon履歴"} to={"/option/history/amazon"}/>
                </li>
            </ul>
        </nav>


    )
}

function OptionNavLink(props : NavProp) {
    let name : string = props.name;
    let to :string = props.to;
    return (
        <NavLink to={to}
                 style={({isActive, isPending, isTransitioning}) => {
                     return {
                         fontWeight: isActive ? "bold" : "",
                         color: isPending ? "red" : "black",
                         viewTransitionName: isTransitioning ? "slide" : "",
                     };
                 }}
                 className={({isActive, isPending, isTransitioning}) =>
                     [
                         isPending ? "pending" : "",
                         isActive ? "active" : "",
                         isTransitioning ? "transitioning" : "",
                     ].join(" ")
                 }
        >{name}</NavLink>
    )
}

export default NavBar;