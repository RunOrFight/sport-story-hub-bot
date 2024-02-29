import { useSelector } from "react-redux";
import { locationsSelectors } from "../Store/Locations/LocationsSelector.ts";
import { ESliceStatus } from "../Store/ESliceStatus.ts";
import { ComponentType, createElement, FC, Fragment } from "react";
import { withProps } from "../Utils/WithProps.ts";
import { Button, Card, Flex, Skeleton } from "antd";
import { Location } from "../../../src/database/entities/Location.ts";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

const LocationCard: FC<Location> = ({ preview, title, address }) => {
  return (
    <Card
      cover={<img alt="example" src={preview?.url} />}
      actions={[<EditOutlined key="edit" />, <DeleteOutlined key="delete" />]}
    >
      <Card.Meta title={title} description={address} />
    </Card>
  );
};

const LocationsPageSuccess = () => {
  const locations = useSelector(locationsSelectors.data);

  return (
    <Flex vertical gap={10} style={{ padding: "16px 16px 62px" }}>
      {locations.map((location) => (
        <LocationCard {...location} key={location.id} />
      ))}

      <Button
        type={"primary"}
        style={{
          position: "fixed",
          bottom: "16px",
          width: "calc(100% - 32px)",
          left: "16px",
        }}
      >
        {"Create New"}
      </Button>
    </Flex>
  );
};

const SLICE_STATUS_TO_COMPONENT_TYPE_MAP: Record<ESliceStatus, ComponentType> =
  {
    [ESliceStatus.idle]: Fragment,
    [ESliceStatus.loading]: withProps(Skeleton)({
      style: { padding: "16px" },
    }),
    [ESliceStatus.error]: Fragment,
    [ESliceStatus.success]: LocationsPageSuccess,
  };

const LocationsPage = () => {
  const status = useSelector(locationsSelectors.status);

  return createElement(SLICE_STATUS_TO_COMPONENT_TYPE_MAP[status]);
};

export { LocationsPage };
