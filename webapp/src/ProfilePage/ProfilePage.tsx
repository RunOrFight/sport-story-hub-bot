import classes from "./ProfilePage.module.css";
import { useParams } from "react-router-dom";
import { getNotNil } from "../Utils/GetNotNil.ts";
import { Skeleton } from "antd";
import { TUser } from "../Models/TUser.ts";
import { useHttpRequestOnMount } from "../Hooks/UseHttpRequestOnMount.ts";
import { numberFormatter } from "../Utils/NumberFormatter.ts";
import type { IError } from "../Models/IError.ts";

const normalizeUser = (data: { user: TUser } | IError) =>
  "error" in data ? data : data.user;

const ProfilePage = () => {
  const { username } = useParams();

  const { data: user } = useHttpRequestOnMount(
    "getUserByUsername",
    [getNotNil(username, "ProfilePage")],
    normalizeUser,
  );

  if (!user) {
    return <Skeleton style={{ padding: 16 }} />;
  }

  if ("error" in user) {
    return <h2 className={classes.error}>{user.error}</h2>;
  }

  const {
    goals,
    losses,
    Elo,
    winRate,
    wins,
    name,
    surname,
    assists,
    draws,
    total,
  } = user;

  return (
    <div className={classes.profilePage}>
      <div className={classes.h1}> {"Profile"}</div>
      <div className={classes.card}>
        <div className={classes.picture} />
        <div className={classes.info}>
          <div className={classes.name}>{`${name} ${surname}`}</div>
          <div className={classes.username}>{username}</div>
        </div>
      </div>

      <div className={classes.details}>
        <h5>{`Games: ${total}`}</h5>
        <h5>{`Wins: ${wins}`}</h5>
        <h5>{`Losses: ${losses}`}</h5>
        <h5>{`Draws: ${draws}`}</h5>
        <h5>{`Win Rate: ${numberFormatter.format(winRate)}%`}</h5>
        <h5>{`Goals: ${goals}`}</h5>
        <h5>{`Assists: ${assists}`}</h5>
        <h5>{`Elo: ${Elo}`}</h5>
      </div>
    </div>
  );
};

export { ProfilePage };
