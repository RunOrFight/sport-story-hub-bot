import { Avatar, Card, Flex, Result, Skeleton, Space, Typography } from "antd";
import { numberFormatter } from "../Utils/NumberFormatter.ts";
import { UserOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import {
  userErrorNotNilSelector,
  userInfoNotNilSelector,
  userStatusSelector,
} from "../Store/User/UserSelectors.ts";
import { ESliceStatus } from "../Store/ESliceStatus.ts";
import { ComponentType, createElement, Fragment } from "react";
import { withProps } from "../Utils/WithProps.ts";

const Error = () => {
  const error = useSelector(userErrorNotNilSelector);

  return <Result status={"error"} title={error} />;
};

const ProfilePageSuccess = () => {
  const userInfo = useSelector(userInfoNotNilSelector);

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
    username,
  } = userInfo;

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

const SLICE_STATUS_TO_COMPONENT_TYPE_MAP: Record<ESliceStatus, ComponentType> =
  {
    [ESliceStatus.idle]: Fragment,
    [ESliceStatus.loading]: withProps(Skeleton)({ style: { padding: 16 } }),
    [ESliceStatus.error]: Error,
    [ESliceStatus.success]: ProfilePageSuccess,
  };

const ProfilePage = () => {
  const status = useSelector(userStatusSelector);

  return createElement(SLICE_STATUS_TO_COMPONENT_TYPE_MAP[status]);
};

export { ProfilePage };
