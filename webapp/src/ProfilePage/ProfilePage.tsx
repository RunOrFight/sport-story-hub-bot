import classes from "./ProfilePage.module.css";
import { useParams } from "react-router-dom";
import { getNotNil } from "../Utils/GetNotNil.ts";
import { Avatar, Card, Flex, Skeleton, Space, Typography } from "antd";
import { useHttpRequestOnMount } from "../Hooks/UseHttpRequestOnMount.ts";
import { numberFormatter } from "../Utils/NumberFormatter.ts";
import type { IError } from "../Models/IError.ts";
import { IUserInitResponse } from "../../../src/types/user.types.ts";
import { UserOutlined } from "@ant-design/icons";

const normalizeUser = (response: { data: IUserInitResponse } | IError) =>
  "error" in response ? response : response.data.user;

const ProfilePage = () => {
  const { username } = useParams();

  const { data: user } = useHttpRequestOnMount(
    "getOrCreateUserByUsername",
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
    <Flex vertical style={{ padding: 10 }}>
      <Typography.Title level={2}>{"Profile"}</Typography.Title>

      <Card>
        <Space size={16}>
          <Avatar shape={"circle"} icon={<UserOutlined />} size={80} />
          <Typography>
            <Typography.Title
              level={3}
              editable
            >{`${name} ${surname}`}</Typography.Title>
            <Typography.Text>{username}</Typography.Text>
          </Typography>
        </Space>
      </Card>

      <Typography>
        <h5>{`Games: ${total}`}</h5>
        <h5>{`Wins: ${wins}`}</h5>
        <h5>{`Losses: ${losses}`}</h5>
        <h5>{`Draws: ${draws}`}</h5>
        <h5>{`Win Rate: ${numberFormatter.format(winRate)}%`}</h5>
        <h5>{`Goals: ${goals}`}</h5>
        <h5>{`Assists: ${assists}`}</h5>
        <h5>{`Elo: ${Elo}`}</h5>
      </Typography>
    </Flex>
  );
};

export { ProfilePage };
