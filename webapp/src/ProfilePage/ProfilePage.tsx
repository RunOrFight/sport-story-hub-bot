import classes from "./ProfilePage.module.css";
import { useParams } from "react-router-dom";
import { getNotNil } from "../Utils/GetNotNil.ts";
import { Skeleton } from "antd";
import { TUser } from "../Models/TUser.ts";
import { useHttpRequestOnMount } from "../Hooks/UseHttpRequestOnMount.ts";

const normalizeUser = (data: { user: TUser } | null) => data?.user;

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

  return (
    <div className={classes.profilePage}>
      <div className={classes.h1}> {"Profile"}</div>
      <div className={classes.card}>
        <div className={classes.picture} />
        <div className={classes.info}>
          <div className={classes.name}>{`${user.name} ${user.surname}`}</div>
          <div className={classes.username}>{user.username}</div>
        </div>
      </div>

      <div>
        <pre>{JSON.stringify(user, null, 2)}</pre>
      </div>
    </div>
  );
};

export { ProfilePage };
