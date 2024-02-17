import classes from "./ProfilePage.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { httpApi } from "../httpApi.ts";
import { ILeaderboardRow } from "../types.ts";
import { getNotNil } from "../Utils/GetNotNil.ts";
import { Skeleton } from "antd";
import { routeMap } from "../routeMap.ts";

const ProfilePage = () => {
  const [user, setUser] = useState<ILeaderboardRow | null>(null);
  const navigate = useNavigate();

  const { username } = useParams();

  useEffect(() => {
    httpApi
      .getUserFromRowsByUsername(getNotNil(username, "ProfilePage"))
      .then(setUser, () => navigate(routeMap.eventsRoute));
  }, [username]);

  if (!user) {
    return <Skeleton style={{ padding: 16 }} />;
  }

  return (
    <div className={classes.profilePage}>
      <div className={classes.h1}> {"Profile"}</div>
      <div className={classes.card}>
        <div className={classes.picture} />
        <div className={classes.info}>
          <div
            className={classes.name}
          >{`${user.firstName} ${user.lastName}`}</div>
          <div className={classes.username}>{user.username}</div>
        </div>
      </div>
    </div>
  );
};

export { ProfilePage };
