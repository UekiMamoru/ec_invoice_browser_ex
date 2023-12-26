import {NavLink} from "react-router-dom";
import nav from '../../../../../../css/nav.module.css';

type NavProp = { name: string, to: string }

const NavBar = () => {
    return (
        <nav>
            <ul className={nav.navigation}>
                <li>
                    <OptionNavLink name={"TOP"} to={"/index.html"}/>
                </li>
                <li>
                    <OptionNavLink name={"Amazon履歴"} to={"/history/amazon"}/>
                </li>
            </ul>
        </nav>


    )
}

function OptionNavLink(props: NavProp) {
    let name: string = props.name;
    let to: string = props.to;
    let linkNav = nav.link;
    let linkNavActive = nav.activeLink;
    return (
        <NavLink to={to}
                 className={({isActive, isPending, isTransitioning}) =>
                     [
                         isActive ? linkNavActive : linkNav,
                         isPending ? "pending" : "",
                         isTransitioning ? "transitioning" : "",
                     ].join(" ")
                 }
        >{name}</NavLink>
    )
}

export default NavBar;