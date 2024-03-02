import classes from "./Layout.module.css";
import { generatePath, NavLink, Outlet } from "react-router-dom";
import { webappRoutes } from "../../../src/constants/webappRoutes.ts";
import { FC } from "react";
import { emoji } from "../../../src/tg_bot/bot_utils/emoji.ts";
import { useSelector } from "react-redux";
import { userInfoUserIdSelector } from "../Store/User/UserSelectors.ts";

interface ILink {
  to: string;
  title: string;
}

const getLinks = (userId: number | undefined): ILink[] => [
  {
    title: emoji.calendar,
    to: webappRoutes.eventsRoute,
  },
  {
    title: emoji.barChart,
    to: webappRoutes.statisticsRoute,
  },
  {
    title: emoji.clipboard,
    to: generatePath(webappRoutes.profileRoute, { id: userId ?? 1 }),
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
  const userId = useSelector(userInfoUserIdSelector);

  return (
    <div className={classes.layout}>
      <div className={classes.content}>
        <Outlet />
      </div>
      <div className={classes.bottomNavigation}>
        {getLinks(userId).map((link) => (
          <LinkComponent {...link} key={link.to} />
        ))}
      </div>
    </div>
  );
};

export { Layout };
