import { eventsSlice } from "../../Store/Events/EventsSlice.ts";
import { useSelector } from "react-redux";
import { withProps } from "../../Utils/WithProps.ts";
import { RequestStatusToComponent } from "../../Components/RequestStatusToComponent.tsx";
import { EVENTS_GET_ALL_REQUEST_SYMBOL } from "../../Store/Events/EventsVariables.ts";
import { isEmpty } from "../../Utils/OneLineUtils.ts";
import { Card, Empty, Flex } from "antd";
import { generatePath, Link } from "react-router-dom";
import { webappRoutes } from "../../../../src/constants/webappRoutes.ts";
import { FixedButton } from "../../Components/FixedButton.tsx";
import { EditOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { FC } from "react";
import { TEvent } from "../../Models/TEvent.ts";
import { getPreviewSrc } from "../../Utils/GetPreviewSrc.ts";
import { DeleteButton } from "../../Components/DeleteButton.tsx";

const DELETE_EVENT_TITLE = "Delete Event?";

const ManageEventCard: FC<TEvent> = ({ id, location }) => {
  return (
    <Card
      cover={<img alt="example" src={getPreviewSrc(location?.preview?.url)} />}
      actions={[
        <Link
          to={generatePath(webappRoutes.manageSingleEventRoute, {
            eventId: id,
          })}
        >
          <InfoCircleOutlined key="info" />
        </Link>,
        <Link
          to={generatePath(webappRoutes.updateEventRoute, {
            eventId: id,
          })}
        >
          <EditOutlined key="edit" />
        </Link>,
        <DeleteButton
          actionCreator={eventsSlice.actions.delete}
          id={id}
          title={DELETE_EVENT_TITLE}
        />,
      ]}
    >
      <Card.Meta title={location?.title} description={location?.address} />
    </Card>
  );
};

const ManageEventsPageSuccess = () => {
  const events = useSelector(eventsSlice.selectors.edges);

  if (isEmpty(events)) {
    return (
      <>
        <Empty style={{ paddingTop: 16 }} description={"There are no events"} />
        <Link to={webappRoutes.createEventRoute}>
          <FixedButton />
        </Link>
      </>
    );
  }

  return (
    <Flex vertical style={{ padding: "16px 16px 62px" }} gap={16}>
      {events.map((event) => (
        <ManageEventCard {...event} key={event.id} />
      ))}

      <Link to={webappRoutes.createEventRoute}>
        <FixedButton />
      </Link>
    </Flex>
  );
};

const ManageEventsPage = withProps(RequestStatusToComponent)({
  requestSymbol: EVENTS_GET_ALL_REQUEST_SYMBOL,
  SUCCESS: ManageEventsPageSuccess,
});

export { ManageEventsPage };
