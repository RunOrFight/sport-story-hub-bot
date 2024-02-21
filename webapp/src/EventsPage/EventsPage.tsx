import { Card, Skeleton } from "antd";
import { generatePath, Link } from "react-router-dom";
import { routeMap } from "../routeMap.ts";
import classes from "./EventsPage.module.css";
import { useHttpRequestOnMount } from "../Hooks/UseHttpRequestOnMount.ts";
import { isEmpty } from "../Utils/OneLineUtils.ts";
import { TEvent } from "../Models/TEvent.ts";

const normalizeEvents = ({ events }: { events: TEvent[] }) => events;

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
        <Link
          key={event.id}
          to={generatePath(routeMap.singleEventRoute, { eventId: event.id })}
        >
          <Card
            hoverable
            title={`${event.location?.title}, ${event.location?.address}`}
            size={"small"}
            style={{ width: "100%" }}
            cover={
              <img
                height={200}
                style={{ objectFit: "cover" }}
                alt={"cover"}
                src={event.location?.preview?.url}
              />
            }
          >
            <pre>{JSON.stringify(event, null, 2)}</pre>
          </Card>
        </Link>
      ))}
    </div>
  );
};

export { EventsPage };
