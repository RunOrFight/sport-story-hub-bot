import classes from "./Layout.module.css";
import { generatePath, NavLink, Outlet } from "react-router-dom";
import { EWebappRoutes } from "../../../src/enums/webapp-routes.enum.ts";
import { FC } from "react";
import { emoji } from "../../../src/tg_bot/bot_utils/emoji.ts";

interface ILink {
  to: string;
  title: string;
}

const LINKS: ILink[] = [
  {
    title: emoji.calendar,
    to: EWebappRoutes.eventsRoute,
  },
  {
    title: emoji.barChart,
    to: EWebappRoutes.statisticsRoute,
  },
  {
    title: emoji.clipboard,
    to: generatePath(EWebappRoutes.profileRoute, {
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
