import { Skeleton } from "antd";
import { generatePath, Link } from "react-router-dom";
import { routeMap } from "../routeMap.ts";
import classes from "./EventsPage.module.css";
import { useHttpRequestOnMount } from "../Hooks/UseHttpRequestOnMount.ts";
import { isEmpty } from "../Utils/OneLineUtils.ts";
import { TEvent } from "../Models/TEvent.ts";
import { FC } from "react";
import {
  getReadableEventDate,
  getReadableEventTime,
} from "../Utils/GetReadableEventDate.ts";
import { getNotNil } from "../Utils/GetNotNil.ts";
import { emoji } from "../../../src/emoji.ts";

const getEventInfo = (
  participants: any[],
  participantsLimit: number,
  price: string,
  notNilDateTime: string,
) => {
  return `
  ${emoji.time}${getReadableEventTime(notNilDateTime)}
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
  const to = generatePath(routeMap.singleEventRoute, { eventId: id });
  const notNilDateTime = getNotNil(dateTime, "Event -> dateTime");

  return (
    <div className={classes.event}>
      <div className={classes.eventHead}>
        <h3 className={classes.eventDataTime}>
          {getReadableEventDate(notNilDateTime)}
        </h3>
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
            notNilDateTime,
          )}
        </p>

        <Link to={to} className={classes.eventButton}>
          {"See Details"}
        </Link>
      </div>
    </div>
  );
};

const normalizeEvents = ({ events }: { events: TEvent[] }) =>
  events.filter(({ dateTime }) => dateTime !== null);

const EventsPage = () => {
  const { data: events } = useHttpRequestOnMount(
    "getAllEvents",
    [],
    normalizeEvents,
  );

  if (!events || isEmpty(events)) {
    return <Skeleton active />;
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
