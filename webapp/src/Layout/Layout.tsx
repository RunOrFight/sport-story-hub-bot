import classes from "./Layout.module.css"
import {NavLink, Outlet} from "react-router-dom";
import {routeMap} from "../routeMap.ts";
import {FC} from "react";

interface ILink {
    to: string;
    title: string;
    icon: string
}

const LINKS: ILink[] = [
    {
        title: "Events",
        to: routeMap.eventsRoute,
        icon: "Icon"
    },
    {
        title: "Statistics",
        to: routeMap.statisticsRoute,
        icon: "Icon"
    },
    {
        title: "Profile",
        to: routeMap.profileRoute,
        icon: "Icon"
    }
]

const LinkComponent: FC<ILink> = ({title, to, icon}) => {
    return <NavLink to={to} className={classes.link}>
        {title}
    </NavLink>
}

const Layout = () => {
    return <div className={classes.layout}>
        <div className={classes.content}>
            <Outlet/>
        </div>
        <div className={classes.bottomNavigation}>
            {LINKS.map((link) => <LinkComponent {...link} key={link.to}/>)}
        </div>
    </div>
}

export {Layout}
