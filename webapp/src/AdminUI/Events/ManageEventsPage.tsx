import { eventsSlice } from "../../Store/Events/EventsSlice.ts";
import { useSelector } from "react-redux";
import { withProps } from "../../Utils/WithProps.ts";
import { RequestStatusToComponent } from "../../Components/RequestStatusToComponent.tsx";
import { EVENTS_GET_ALL_REQUEST_SYMBOL } from "../../Store/Events/EventsVariables.ts";
import { isEmpty } from "../../Utils/OneLineUtils.ts";
import { Empty, Flex } from "antd";
import { EventCard } from "../../Components/EventCard.tsx";
import { Link } from "react-router-dom";
import { webappRoutes } from "../../../../src/constants/webappRoutes.ts";
import { CreateButton } from "../../Components/CreateButton.tsx";

const ManageEventsPageSuccess = () => {
  const events = useSelector(eventsSlice.selectors.edges);

  if (isEmpty(events)) {
    return (
      <Empty style={{ paddingTop: 16 }} description={"There are no events"} />
    );
  }

  return (
    <Flex vertical style={{ padding: "16px 16px 62px" }}>
      {events.map((event) => (
        <EventCard {...event} key={event.id} />
      ))}

      <Link to={webappRoutes.createEventsRoute}>
        <CreateButton />
      </Link>
    </Flex>
  );
};

const ManageEventsPage = withProps(RequestStatusToComponent)({
  requestSymbol: EVENTS_GET_ALL_REQUEST_SYMBOL,
  SUCCESS: ManageEventsPageSuccess,
});

export { ManageEventsPage };
