import { useDispatch, useSelector } from "react-redux";
import { locationsSelectors } from "../../../Store/Locations/LocationsSelector.ts";
import { ComponentType, createElement, FC, Fragment } from "react";
import { withProps } from "../../../Utils/WithProps.ts";
import { Button, Card, Flex, Skeleton } from "antd";
import { Location } from "../../../../../src/database/entities/Location.ts";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import AnchorLink from "antd/es/anchor/AnchorLink";
import { generatePath, Link } from "react-router-dom";
import { webappRoutes } from "../../../../../src/constants/webappRoutes.ts";
import { locationsSlice } from "../../../Store/Locations/LocationsSlice.ts";
import { requestManagerSlice } from "../../../Store/RequestManager/RequestManagerSlice.ts";
import { LOCATIONS_GET_ALL_REQUEST_SYMBOL } from "../../../Store/Locations/LocationsVariables.ts";
import { useParamSelector } from "../../../Hooks/UseParamSelector.ts";
import { ERequestStatus } from "../../../Store/RequestManager/RequestManagerModels.ts";

const LocationCard: FC<Location> = ({ preview, url, address, title, id }) => {
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(locationsSlice.actions.delete({ id }));
  };

  return (
    <>
      <Card
        cover={<img alt="example" src={preview?.url} />}
        actions={[
          <Link
            to={generatePath(webappRoutes.updateLocationRoute, {
              locationId: id,
            })}
          >
            <EditOutlined key="edit" />
          </Link>,
          <DeleteOutlined key="delete" onClick={onClick} />,
        ]}
      >
        <Card.Meta title={title} description={address} />
        {url ? <AnchorLink href={url} title={"Url"} /> : url}
      </Card>
    </>
  );
};

const LocationsPageSuccess = () => {
  const locations = useSelector(locationsSelectors.data);

  return (
    <Flex vertical gap={16} style={{ padding: "16px 16px 62px" }}>
      {locations.map((location) => (
        <LocationCard {...location} key={location.id} />
      ))}

      <Link to={webappRoutes.createLocationRoute}>
        <Button
          type={"primary"}
          style={{
            position: "fixed",
            bottom: "16px",
            width: "calc(100% - 32px)",
            left: "16px",
          }}
          icon={<PlusOutlined />}
        >
          {"Create New"}
        </Button>
      </Link>
    </Flex>
  );
};

const SLICE_STATUS_TO_COMPONENT_TYPE_MAP: Record<
  ERequestStatus,
  ComponentType
> = {
  [ERequestStatus.idle]: Fragment,
  [ERequestStatus.loading]: withProps(Skeleton)({
    style: { padding: "16px" },
  }),
  [ERequestStatus.error]: Fragment,
  [ERequestStatus.success]: LocationsPageSuccess,
};

const LocationsPage = () => {
  const status = useParamSelector(
    requestManagerSlice.selectors.statusBySymbol,
    LOCATIONS_GET_ALL_REQUEST_SYMBOL,
  );

  return createElement(SLICE_STATUS_TO_COMPONENT_TYPE_MAP[status]);
};

export { LocationsPage };
