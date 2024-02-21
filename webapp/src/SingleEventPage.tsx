import { useParams } from "react-router-dom";
import { Flex, Skeleton } from "antd";
import { useHttpRequestOnMount } from "./Hooks/UseHttpRequestOnMount.ts";
import { getNotNil } from "./Utils/GetNotNil.ts";
import { TEvent } from "./Models/TEvent.ts";

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

  return (
    <Flex vertical gap={"small"}>
      <pre>{JSON.stringify(event, null, 2)}</pre>
    </Flex>
  );
};

export { SingleEventPage };
