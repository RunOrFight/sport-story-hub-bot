import { Skeleton } from "antd";
import { generatePath, Link } from "react-router-dom";
import { webappRoutes } from "../../../src/constants/webappRoutes.ts";
import classes from "./EventsPage.module.css";
import { useHttpRequestOnMount } from "../Hooks/UseHttpRequestOnMount.ts";
import { isEmpty } from "../Utils/OneLineUtils.ts";
import { TEvent } from "../Models/TEvent.ts";
import { FC } from "react";
import {
  getReadableEventDate,
  getReadableEventTime,
} from "../Utils/GetReadableEventDate.ts";
import { emoji } from "../../../src/tg_bot/bot_utils/emoji.ts";
import { EmptyEventsPage } from "../Empty/Empty.tsx";

const getEventInfo = (
  participants: any[],
  participantsLimit: number,
  price: string,
  dateTime: string | null,
) => {
  return `
  ${emoji.time}${dateTime ? getReadableEventTime(dateTime) : "**-**"}
  ${emoji.participants}${participants.length}/${participantsLimit}
   ${emoji.price}${price}
    `;
};

const Event: FC<TEvent> = ({
  id,
  dateTime,
  participantsLimit,
  participants,
  location,
  price,
  status,
}) => {
  const to = generatePath(webappRoutes.singleEventRoute, { eventId: id });

  return (
    <div className={classes.event}>
      <div className={classes.eventHead}>
        {dateTime ? (
          <h3 className={classes.eventDataTime}>
            {getReadableEventDate(dateTime)}
          </h3>
        ) : null}
        <span className={classes.eventStatus}>{status}</span>
      </div>

      <div className={classes.eventContent}>
        <h2 className={classes.eventLocation}>
          {location ? location.title : "Location is not specified"}
        </h2>
        <p className={classes.eventInfo}>
          {getEventInfo(
            participants,
            participantsLimit ?? 0,
            price ?? "",
            dateTime,
          )}
        </p>

        <Link to={to} className={classes.eventButton}>
          {"See Details"}
        </Link>
      </div>
    </div>
  );
};

const normalizeEvents = ({ events }: { events: TEvent[] }) => events;

const EventsPage = () => {
  const { data: events } = useHttpRequestOnMount(
    "getAllEvents",
    [],
    normalizeEvents,
  );

  if (!events) {
    return <Skeleton active />;
  }

  if (isEmpty(events)) {
    return <EmptyEventsPage />;
  }

  return (
    <div className={classes.eventsPage}>
      {events.map((event) => (
        <Event {...event} key={event.id} />
      ))}
    </div>
  );
};

export { EventsPage };
