import {
  Avatar,
  Card,
  Collapse,
  CollapseProps,
  Empty,
  Flex,
  List,
  Table,
  Typography,
} from "antd";
import { BackButton } from "../../Components/BackButton.tsx";
import { useDispatch, useSelector } from "react-redux";
import { eventsSlice } from "../../Store/Events/EventsSlice.ts";
import { withProps } from "../../Utils/WithProps.ts";
import { RequestStatusToComponent } from "../../Components/RequestStatusToComponent.tsx";
import { EVENTS_GET_BY_ID_REQUEST_SYMBOL } from "../../Store/Events/EventsVariables.ts";
import {
  TEventGame,
  TEventGameTeam,
  TEventTeams,
} from "../../Models/TEvent.ts";
import { FC, useState } from "react";
import { ColumnsType } from "antd/es/table";
import { Participant } from "../../../../src/database/entities/Participant.ts";
import { DeleteOutlined, UserOutlined } from "@ant-design/icons";
import { isEmpty } from "../../Utils/OneLineUtils.ts";
import { getNotNil } from "../../Utils/GetNotNil.ts";
import { TeamParticipant } from "../../../../src/database/entities/TeamParticipant.ts";
import { AppDispatch } from "../../Store/App/CreateStore.ts";

const COLUMNS: ColumnsType<Participant> = [
  {
    title: "#",
    dataIndex: "user",
    render: ({ photo }) => (
      <Avatar size={44} src={photo} icon={photo ? null : <UserOutlined />} />
    ),
    width: 50,
    align: "center",
  },
  {
    title: "Username",
    dataIndex: "user",
    render: ({ username, name }) => {
      return (
        <Typography>
          <Typography.Title level={5}>{name ?? "No Name"}</Typography.Title>

          <Typography.Text>{username}</Typography.Text>
        </Typography>
      );
    },
  },
  {
    title: "Elo",
    dataIndex: ["user", "Elo"],
    align: "right",
  },
];

const GameTeam: FC<TEventGameTeam> = ({ name, teamsParticipants }) => {
  return (
    <Flex vertical>
      <Typography.Title level={5}>{name}</Typography.Title>

      <Table
        dataSource={teamsParticipants.map((it) => it.participant)}
        columns={COLUMNS}
      />
    </Flex>
  );
};

const Game: FC<TEventGame> = ({ gameTeams }) => {
  return (
    <Flex vertical>
      {gameTeams.map(({ team }) => (
        <GameTeam {...team} key={team.id} />
      ))}
    </Flex>
  );
};

const Games: FC<{ games: TEventGame[] }> = ({ games }) => {
  const [activeTabKey, setActiveTabKey] = useState<string>(String(games[0].id));

  const onTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  const tabList = games.map(({ name, id }) => ({
    tab: name,
    key: String(id),
  }));

  const game = getNotNil(
    games.find((it) => String(it.id) === activeTabKey),
    "Games",
  );

  return (
    <Card
      style={{ width: "100%" }}
      title={"Games"}
      tabList={tabList}
      onTabChange={onTabChange}
      activeTabKey={activeTabKey}
    >
      <Game {...game} key={game.id} />
    </Card>
  );
};

const renderItem =
  (dispatch: AppDispatch, teamId: number) =>
  ({ id, participant: { user } }: TeamParticipant, index: number) => {
    const fallback = `https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`;

    const onClick = () => {
      dispatch(
        eventsSlice.actions.deleteTeamParticipant({
          participantId: id,
          teamId,
        }),
      );
    };

    return (
      <List.Item
        key={id}
        actions={[
          <span>{user?.Elo}</span>,
          <DeleteOutlined onClick={onClick} />,
        ]}
      >
        <List.Item.Meta
          title={user?.name ?? "No Name"}
          description={user?.username}
          avatar={<Avatar src={fallback} />}
        />
      </List.Item>
    );
  };

const EventTeams: FC<{ teams: TEventTeams }> = ({ teams }) => {
  const dispatch = useDispatch();

  const items: CollapseProps["items"] = teams.map(
    ({ id, name, teamsParticipants }) => {
      return {
        label: name,
        key: id,
        children: (
          <List
            dataSource={teamsParticipants}
            renderItem={renderItem(dispatch, id)}
          />
        ),
      };
    },
  );

  return <Collapse items={items} />;
};

const ManageSingleEventPageSuccess = () => {
  const singleEvent = useSelector(eventsSlice.selectors.singleEventNotNil);
  const { participants, games, teams } = singleEvent;

  return (
    <Flex style={{ padding: 16 }} vertical gap={16}>
      <BackButton />
      <Typography.Title level={4}>{"Teams: "}</Typography.Title>
      <EventTeams teams={teams} />

      <Typography.Title level={4}>{"Participants: "}</Typography.Title>
      <Table dataSource={participants} columns={COLUMNS} />

      {isEmpty(games) ? (
        <Empty description={"No games"} />
      ) : (
        <Games games={games} />
      )}
    </Flex>
  );
};

const ManageSingleEventPage = withProps(RequestStatusToComponent)({
  requestSymbol: EVENTS_GET_BY_ID_REQUEST_SYMBOL,
  SUCCESS: ManageSingleEventPageSuccess,
});

export { ManageSingleEventPage };
