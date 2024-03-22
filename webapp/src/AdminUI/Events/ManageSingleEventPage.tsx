import {
  Button,
  Collapse,
  CollapseProps,
  Flex,
  List,
  Popconfirm,
  Segmented,
  SegmentedProps,
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
import { TEventGame, TEventTeams } from "../../Models/TEvent.ts";
import { FC, useState } from "react";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { getNotNil } from "../../Utils/GetNotNil.ts";
import { generatePath, Link } from "react-router-dom";
import { webappRoutes } from "../../../../src/constants/webappRoutes.ts";
import { teamParticipantRenderItem } from "./UserRenderItem.tsx";
import { PARTICIPANT_TABLE_COLUMNS } from "./ParticipantTableColumns.tsx";

const Game: FC<TEventGame> = ({ gameTeams }) => {
  const dispatch = useDispatch();

  const items: CollapseProps["items"] = gameTeams.map(
    ({ team: { name, id, teamsParticipants } }) => ({
      label: name,
      key: `team_${id}`,
      children: (
        <List
          dataSource={teamsParticipants}
          renderItem={teamParticipantRenderItem(dispatch, id)}
        />
      ),
    }),
  );

  return <Collapse items={items} />;
};

const EventGames: FC<{ games: TEventGame[] }> = ({ games }) => {
  const [activeTabKey, setActiveTabKey] = useState<number>(games[0].id);

  const onChange: SegmentedProps<number>["onChange"] = (value) => {
    if (value === -1) {
      return;
    }
    setActiveTabKey(value);
  };

  const gamesTabs: SegmentedProps<number>["options"] = games.map(
    ({ name, id }) => ({
      label: name,
      value: id,
    }),
  );

  const tabList: SegmentedProps<number>["options"] = gamesTabs.concat({
    icon: <PlusOutlined />,
    value: -1,
  });

  const game = getNotNil(
    games.find((it) => it.id === activeTabKey),
    "EventGames",
  );

  return (
    <Flex vertical gap={16}>
      <Segmented options={tabList} onChange={onChange} />
      <Game {...game} key={game.id} />
    </Flex>
  );
};

interface IEventTeamsProps {
  teams: TEventTeams;
  eventId: number;
}

const EventTeams: FC<IEventTeamsProps> = ({ teams, eventId }) => {
  const dispatch = useDispatch();

  const onConfirm = (teamId: number) => () => {
    dispatch(eventsSlice.actions.deleteSingleEventTeam({ id: teamId }));
  };

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
            <Popconfirm
              onPopupClick={(e) => e.stopPropagation()}
              title="Delete the team"
              description="Are you sure to delete this team?"
              okText="Yes"
              cancelText="No"
              onConfirm={onConfirm(id)}
            >
              <DeleteOutlined
                style={{ color: "red" }}
                onClick={(e) => e.stopPropagation()}
              />
            </Popconfirm>
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

      <Typography.Title level={4}>{"Games: "}</Typography.Title>

      <EventGames games={games} />

      <Typography.Title level={4}>{"Participants: "}</Typography.Title>
      <Table
        dataSource={participants}
        columns={PARTICIPANT_TABLE_COLUMNS}
        showHeader={false}
      />
    </Flex>
  );
};

const ManageSingleEventPage = withProps(RequestStatusToComponent)({
  requestSymbol: EVENTS_GET_BY_ID_REQUEST_SYMBOL,
  SUCCESS: ManageSingleEventPageSuccess,
});

export { ManageSingleEventPage };
