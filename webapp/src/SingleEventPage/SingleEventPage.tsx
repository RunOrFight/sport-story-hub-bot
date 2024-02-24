import { Link, useParams } from "react-router-dom";
import { Skeleton } from "antd";
import { useHttpRequestOnMount } from "../Hooks/UseHttpRequestOnMount.ts";
import { getNotNil } from "../Utils/GetNotNil.ts";
import { TEvent } from "../Models/TEvent.ts";
import classes from "./SingleEventPage.module.css";
import { routeMap } from "../routeMap.ts";
import { getReadableEventDate } from "../Utils/GetReadableEventDate.ts";

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

  const { status, dateTime, description, price } = event;

  return (
    <div className={classes.singleEvent}>
      <div className={classes.head}>
        <Link to={routeMap.eventsRoute} className={classes.back}>
          {"Back"}
        </Link>
        <span className={classes.status}>{status}</span>
      </div>

      <div className={classes.body}>
        {dateTime ? <h2>{getReadableEventDate(dateTime)}</h2> : null}

        <span>{price}</span>

        <p>{description}</p>
        <pre>{JSON.stringify(event, null, 2)}</pre>
      </div>
    </div>
  );
};

export { SingleEventPage };
