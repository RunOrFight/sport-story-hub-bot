import { generatePath, Link, Navigate } from "react-router-dom";
import { webappRoutes } from "../../../src/constants/webappRoutes.ts";
import { useDispatch, useSelector } from "react-redux";
import {
  userInfoUserIdSelector,
  userSelectors,
} from "../Store/User/UserSelectors.ts";
import { Button, Flex, Form, Input, Result, Skeleton } from "antd";
import { userSlice } from "../Store/User/UserSlice.ts";
import { IUserUpdatePayload } from "../../../src/types/user.types.ts";
import { ERequestStatus } from "../Store/RequestManager/ERequestStatus.ts";
import { ComponentType, createElement } from "react";
import { withProps } from "../Utils/WithProps.ts";

const UpdateProfilePageForm = () => {
  const userId = useSelector(userInfoUserIdSelector);
  const profilePage = useSelector(userSelectors.profilePage);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const onFinish = (values: IUserUpdatePayload) => {
    dispatch(userSlice.actions.update(values));
  };

  if (!userId || !profilePage) {
    return <Skeleton />;
  }

  if (userId !== profilePage.id) {
    return (
      <Navigate
        to={generatePath(webappRoutes.profileRoute, {
          id: userId,
        })}
      />
    );
  }

  const initialValues: IUserUpdatePayload = {
    name: profilePage.name,
    surname: profilePage.surname,
    username: profilePage.username,
  };

  return (
    <Flex vertical style={{ padding: 16 }}>
      <Flex justify={"end"}>
        <Link to={".."} relative={"path"}>
          <Button>{"Back"}</Button>
        </Link>
      </Flex>
      <Form form={form} onFinish={onFinish} initialValues={initialValues}>
        <Form.Item name={"username"} hidden>
          <Input />
        </Form.Item>

        <Form.Item label={"Name"} name={"name"}>
          <Input />
        </Form.Item>

        <Form.Item label={"Surname"} name={"surname"}>
          <Input />
        </Form.Item>

        <Form.Item>
          <Button htmlType={"submit"} type={"primary"}>
            {"Submit"}
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

const GoToProfile = () => {
  const dispatch = useDispatch();

  const id = useSelector(userInfoUserIdSelector);
  const onClick = () => {
    dispatch(userSlice.actions.updateClear());
  };

  return (
    <Link
      to={
        id
          ? generatePath(webappRoutes.profileRoute, { id })
          : webappRoutes.eventsRoute
      }
      onClick={onClick}
    >
      <Button>{"Go to profile"}</Button>
    </Link>
  );
};

const SLICE_STATUS_TO_COMPONENT_TYPE_MAP: Record<
  ERequestStatus,
  ComponentType
> = {
  [ERequestStatus.idle]: UpdateProfilePageForm,
  [ERequestStatus.loading]: withProps(Skeleton)({ style: { padding: 16 } }),
  [ERequestStatus.error]: withProps(Result)({
    status: "error",
    title: "Update failed",
    extra: <GoToProfile />,
  }),
  [ERequestStatus.success]: withProps(Result)({
    status: "success",
    title: "Success",
    extra: <GoToProfile />,
  }),
};

const UpdateProfilePage = () => {
  const status = useSelector(userSelectors.updateStatus);

  return createElement(SLICE_STATUS_TO_COMPONENT_TYPE_MAP[status]);
};

export { UpdateProfilePage };
