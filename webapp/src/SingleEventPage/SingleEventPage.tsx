import { Link, useParams } from "react-router-dom";
import { Skeleton } from "antd";
import { useHttpRequestOnMount } from "../Hooks/UseHttpRequestOnMount.ts";
import { getNotNil } from "../Utils/GetNotNil.ts";
import type { TEvent, TEventGame, TEventGameTeam } from "../Models/TEvent.ts";
import classes from "./SingleEventPage.module.css";
import { routeMap } from "../routeMap.ts";
import {
  getReadableEventDate,
  getReadableEventTime,
} from "../Utils/GetReadableEventDate.ts";
import { type FC } from "react";
import { httpApi } from "../httpApi.ts";

const Team: FC<TEventGameTeam> = ({ name, teamsParticipants }) => {
  return (
    <div className={classes.team}>
      <h5>{name}</h5>

      <div>
        {teamsParticipants.map(
          ({
            participant: {
              user: { name, surname },
            },
            id,
          }) => (
            <div key={id}>{`${name} ${surname}`}</div>
          ),
        )}
      </div>
    </div>
  );
};

const Game: FC<TEventGame> = ({ name, gameTeams }) => (
  <div className={classes.game}>
    <h3>{name}</h3>

    <div>
      {gameTeams.map(({ id, team }) => (
        <Team {...team} key={id} />
      ))}
    </div>
  </div>
);

const normalizeEvent = (data: { event: TEvent } | null) => data?.event;
const SingleEventPage = () => {
  const { eventId } = useParams();

  const { data: event } = useHttpRequestOnMount(
    "getEventById",
    [getNotNil(eventId, "SingleEventPage")],
    normalizeEvent,
  );

  if (!event) {
    return <Skeleton active />;
  }

  const { status, dateTime, description, price, games, id, participants } =
    event;

  const username = Telegram.WebApp.initDataUnsafe.user?.username;

  const onClick = username
    ? () => {
        const isUserInParticipants = !!participants.find(
          (it) => it.user.username === username,
        );

        httpApi[isUserInParticipants ? "leaveEvent" : "joinEvent"]({
          eventId: id,
          username,
        });
      }
    : undefined;

  return (
    <div className={classes.singleEvent}>
      <div className={classes.head}>
        <Link to={routeMap.eventsRoute} className={classes.back}>
          {"Back"}
        </Link>
        <span className={classes.status}>{status}</span>
      </div>

      <div className={classes.body}>
        {dateTime ? (
          <h2>{`${getReadableEventDate(dateTime)} - ${getReadableEventTime(dateTime)}`}</h2>
        ) : null}

        <p>{description}</p>

        <div className={classes.section}>
          <h4>{"Games:"}</h4>

          {games.map((game) => (
            <Game {...game} key={game.id} />
          ))}
        </div>

        <button
          className={classes.join}
          onClick={onClick}
        >{`Join ${price}`}</button>
      </div>
    </div>
  );
};

export { SingleEventPage };
