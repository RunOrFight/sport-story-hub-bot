import classes from "./Layout.module.css";
import { generatePath, NavLink, Outlet } from "react-router-dom";
import { routeMap } from "../routeMap.ts";
import { FC } from "react";
import { emoji } from "../../../src/emoji.ts";

interface ILink {
  to: string;
  title: string;
}

const LINKS: ILink[] = [
  {
    title: emoji.calendar,
    to: routeMap.eventsRoute,
  },
  {
    title: emoji.barChart,
    to: routeMap.statisticsRoute,
  },
  {
    title: emoji.clipboard,
    to: generatePath(routeMap.profileRoute, {
      username: Telegram.WebApp.initDataUnsafe.user?.username ?? "@@admin@@",
    }),
  },
];

const LinkComponent: FC<ILink> = ({ title, to }) => {
  return (
    <NavLink to={to} className={classes.link}>
      {title}
    </NavLink>
  );
};

const Layout = () => {
  return (
    <div className={classes.layout}>
      <div className={classes.content}>
        <Outlet />
      </div>
      <div className={classes.bottomNavigation}>
        {LINKS.map((link) => (
          <LinkComponent {...link} key={link.to} />
        ))}
      </div>
    </div>
  );
};

export { Layout };
