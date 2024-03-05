import { ComponentType, createElement, FC, Fragment } from "react";
import { useAppSelector } from "../Hooks/UseAppSelector.ts";
import { requestManagerSlice } from "../Store/RequestManager/RequestManagerSlice.ts";
import { Result, Skeleton } from "antd";
import { BackButton } from "./BackButton.tsx";
import { withProps } from "../Utils/WithProps.ts";
import {
  ERequestStatus,
  IWithRequestSymbol,
} from "../Store/RequestManager/RequestManagerModels.ts";

const Error: FC<IWithRequestSymbol> = ({ requestSymbol }) => {
  const error = useAppSelector((state) =>
    requestManagerSlice.selectors.errorBySymbol(state, requestSymbol),
  );

  return (
    <Result
      title={"Something went wrong"}
      subTitle={error}
      status={"error"}
      extra={<BackButton />}
    />
  );
};

interface IRequestStatusToComponentMap
    extends Record<Exclude<ERequestStatus, ERequestStatus.error>, ComponentType> {
    [ERequestStatus.error]: ComponentType<IWithRequestSymbol>;
}

const REQUEST_STATUS_TO_COMPONENT_MAP: IRequestStatusToComponentMap = {
    [ERequestStatus.error]: Error,
    [ERequestStatus.success]: withProps(Result)({
        status: "success",
        title: "Success",
        extra: <BackButton/>,
    }),
    [ERequestStatus.loading]: withProps(Skeleton)({
        style: {padding: 16},
    }),
    [ERequestStatus.idle]: Fragment,
};

type TRequestStatusToComponentProps = Partial<IRequestStatusToComponentMap> &
    IWithRequestSymbol;

const RequestStatusToComponent: FC<TRequestStatusToComponentProps> = ({
                                                                          requestSymbol,
                                                                          ERROR,
                                                                          ...rest
                                                                      }) => {
    const status = useAppSelector((state) =>
        requestManagerSlice.selectors.statusBySymbol(state, requestSymbol),
    );

    if (status === ERequestStatus.error) {
        return createElement(
            ERROR ?? REQUEST_STATUS_TO_COMPONENT_MAP[ERequestStatus.error],
            {requestSymbol},
        );
    }

    return createElement(rest[status] ?? REQUEST_STATUS_TO_COMPONENT_MAP[status]);
};

export {RequestStatusToComponent};
