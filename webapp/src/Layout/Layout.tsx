import classes from "./Layout.module.css"
import {generatePath, NavLink, Outlet} from "react-router-dom";
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
        to: generatePath(routeMap.profileRoute, {username: Telegram.WebApp.initDataUnsafe.user?.username ?? "@@admin@@"}),
        icon: "Icon"
    }
]

const LinkComponent: FC<ILink> = ({title, to}) => {
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
