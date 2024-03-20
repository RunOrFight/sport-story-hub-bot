import {
  Button,
  Card,
  Collapse,
  CollapseProps,
  Empty,
  Flex,
  List,
  Space,
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
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { isEmpty } from "../../Utils/OneLineUtils.ts";
import { getNotNil } from "../../Utils/GetNotNil.ts";
import { generatePath, Link } from "react-router-dom";
import { webappRoutes } from "../../../../src/constants/webappRoutes.ts";
import { teamParticipantRenderItem } from "./UserRenderItem.tsx";
import { PARTICIPANT_TABLE_COLUMNS } from "./ParticipantTableColumns.tsx";

const GameTeam: FC<TEventGameTeam> = ({ name, teamsParticipants }) => {
  return (
    <Flex vertical>
      <Typography.Title level={5}>{name}</Typography.Title>

      <Table
        dataSource={teamsParticipants.map((it) => it.participant)}
        columns={PARTICIPANT_TABLE_COLUMNS}
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

interface IEventTeamsProps {
  teams: TEventTeams;
  eventId: number;
}

const EventTeams: FC<IEventTeamsProps> = ({ teams, eventId }) => {
  const dispatch = useDispatch();

  const items: CollapseProps["items"] = teams.map(
    ({ id, name, teamsParticipants }) => {
      return {
        label: name,
        key: `team_${id}`,
        extra: (
          <Space>
            <Link
              to={generatePath(webappRoutes.updateSingleEventTeamRoute, {
                eventId,
                teamId: id,
              })}
            >
              <EditOutlined />
            </Link>

            <DeleteOutlined style={{ color: "red" }} />
          </Space>
        ),
        children: (
          <List
            dataSource={teamsParticipants}
            renderItem={teamParticipantRenderItem(dispatch, id)}
          />
        ),
      };
    },
  );

  return <Collapse items={items} />;
};

const ManageSingleEventPageSuccess = () => {
  const singleEvent = useSelector(eventsSlice.selectors.singleEventNotNil);
  const { participants, games, teams, id } = singleEvent;

  return (
    <Flex style={{ padding: 16 }} vertical gap={16}>
      <BackButton />

      <Typography.Title level={4}>{"Teams: "}</Typography.Title>

      <Link
        style={{ width: "fit-content" }}
        to={generatePath(webappRoutes.createSingleEventTeamRoute, {
          eventId: id,
        })}
      >
        <Button icon={<PlusOutlined />}>{"Add New"}</Button>
      </Link>

      <EventTeams teams={teams} eventId={id} />

      <Typography.Title level={4}>{"Participants: "}</Typography.Title>
      <Table
        dataSource={participants}
        columns={PARTICIPANT_TABLE_COLUMNS}
        showHeader={false}
      />

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
