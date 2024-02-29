import { Button, Flex, Form, Input, Result, Skeleton, Upload } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  locationsSelectors,
  updateLocationFormInitialValuesByIdSelector,
} from "../Store/Locations/LocationsSelector.ts";
import { Link, useParams } from "react-router-dom";
import { getNotNil } from "../Utils/GetNotNil.ts";
import { UploadOutlined } from "@ant-design/icons";
import { locationsSlice } from "../Store/Locations/LocationsSlice.ts";
import { TLocationUpdatePayload } from "../../../src/types/location.types.ts";
import { webappRoutes } from "../../../src/constants/webappRoutes.ts";
import { ESliceStatus } from "../Store/ESliceStatus.ts";
import { ComponentType, createElement } from "react";
import { withProps } from "../Utils/WithProps.ts";

const GoToLocations = () => {
  const dispatch = useDispatch();

  const onClick = () => {
    dispatch(locationsSlice.actions.updateClear());
  };

  return (
    <Link to={webappRoutes.locationsRoute} onClick={onClick}>
      <Button>{"Go to locations"}</Button>
    </Link>
  );
};

const UpdateLocationForm = () => {
  const { locationId } = useParams();
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const onFinish = (values: TLocationUpdatePayload) => {
    dispatch(locationsSlice.actions.update(values));
  };

  const initialValues = useSelector(
    updateLocationFormInitialValuesByIdSelector(
      getNotNil(locationId, "UpdateLocationForm"),
    ),
  );

  return (
    <Flex style={{ padding: 16 }} vertical>
      <Flex justify={"end"}>
        <Link to={webappRoutes.locationsRoute}>
          <Button>{"Back"}</Button>
        </Link>
      </Flex>
      <Form form={form} onFinish={onFinish} initialValues={initialValues}>
        <Form.Item name={"id"} style={{ display: "none" }} />

        <Form.Item required label={"Title"} name={"title"}>
          <Input />
        </Form.Item>

        <Form.Item label={"Address"} name={"address"}>
          <Input />
        </Form.Item>

        <Form.Item label={"Url"} name={"url"}>
          <Input />
        </Form.Item>

        <Form.Item label={"Preview"} name={"previewId"} normalize={() => -1}>
          <Upload>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType={"submit"}>
            {"Submit"}
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

const SLICE_STATUS_TO_COMPONENT_TYPE_MAP: Record<ESliceStatus, ComponentType> =
  {
    [ESliceStatus.idle]: UpdateLocationForm,
    [ESliceStatus.loading]: withProps(Skeleton)({ style: { padding: 16 } }),
    [ESliceStatus.error]: withProps(Result)({
      status: "error",
      title: "Update failed",
      extra: <GoToLocations />,
    }),
    [ESliceStatus.success]: withProps(Result)({
      status: "success",
      title: "Success",
      extra: <GoToLocations />,
    }),
  };

const UpdateLocationPage = () => {
  const status = useSelector(locationsSelectors.updateStatus);

  return createElement(SLICE_STATUS_TO_COMPONENT_TYPE_MAP[status]);
};

export { UpdateLocationPage };
