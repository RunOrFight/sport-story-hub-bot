import { eventsSlice } from "../../Store/Events/EventsSlice.ts";
import { useDispatch, useSelector } from "react-redux";
import { withProps } from "../../Utils/WithProps.ts";
import { RequestStatusToComponent } from "../../Components/RequestStatusToComponent.tsx";
import { EVENTS_GET_ALL_REQUEST_SYMBOL } from "../../Store/Events/EventsVariables.ts";
import { isEmpty } from "../../Utils/OneLineUtils.ts";
import { Card, Empty, Flex } from "antd";
import { generatePath, Link } from "react-router-dom";
import { webappRoutes } from "../../../../src/constants/webappRoutes.ts";
import { CreateButton } from "../../Components/CreateButton.tsx";
import { DeleteOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";
import { FC } from "react";
import { TEvent } from "../../Models/TEvent.ts";

const ManageEventCard: FC<TEvent> = ({ id, location }) => {
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(eventsSlice.actions.delete({ id }));
  };

  return (
    <Card
      cover={<img alt="example" src={location?.preview?.url} />}
      actions={[
        <Link
          to={generatePath(webappRoutes.manageSingleEventRoute, {
            eventId: id,
          })}
        >
          <UserOutlined key="user" />
        </Link>,
        <Link
          to={generatePath(webappRoutes.updateEventRoute, {
            eventId: id,
          })}
        >
          <EditOutlined key="edit" />
        </Link>,
        <DeleteOutlined key="delete" onClick={onClick} />,
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
      <Empty style={{ paddingTop: 16 }} description={"There are no events"} />
    );
  }

  return (
    <Flex vertical style={{ padding: "16px 16px 62px" }} gap={16}>
      {events.map((event) => (
        <ManageEventCard {...event} key={event.id} />
      ))}

      <Link to={webappRoutes.createEventRoute}>
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
