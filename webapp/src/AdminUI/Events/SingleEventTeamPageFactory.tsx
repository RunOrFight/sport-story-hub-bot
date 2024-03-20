import { generatePath, useParams } from "react-router-dom";
import { Flex, Form, Input, Table } from "antd";
import { eventsSlice } from "../../Store/Events/EventsSlice.ts";
import { BackButton } from "../../Components/BackButton.tsx";
import { webappRoutes } from "../../../../src/constants/webappRoutes.ts";
import { FixedButton } from "../../Components/FixedButton.tsx";
import { FC } from "react";
import { useSelector } from "react-redux";
import { TableRowSelection } from "antd/es/table/interface";
import { Participant } from "../../../../src/database/entities/Participant.ts";
import { PARTICIPANT_TABLE_COLUMNS } from "./ParticipantTableColumns.tsx";
import { RequestStatusToComponent } from "../../Components/RequestStatusToComponent.tsx";
import { withProps } from "../../Utils/WithProps.ts";
import { EVENTS_GET_BY_ID_REQUEST_SYMBOL } from "../../Store/Events/EventsVariables.ts";
import { getNotNil } from "../../Utils/GetNotNil.ts";

interface IAddParticipantsProps {
  onChange?: (ids: number[]) => void;
  value?: number[];
  id?: string;
}

const AddParticipants: FC<IAddParticipantsProps> = ({ value, onChange }) => {
  const eventParticipants = useSelector(
    eventsSlice.selectors.singleEventParticipants,
  );

  const rowSelection: TableRowSelection<Participant> = {
    type: "checkbox",
    onChange: (selectedRowKeys) => {
      onChange?.(selectedRowKeys as number[]);
    },
    selectedRowKeys: value,
  };

  return (
    <Table
      columns={PARTICIPANT_TABLE_COLUMNS}
      showHeader={false}
      rowSelection={rowSelection}
      rowKey={"id"}
      dataSource={eventParticipants}
    />
  );
};

interface ISingleEventTeamFromInitialValues {
  name: string;
  participantIds: number[];
}

interface ISingleEventTeamFromFinishValues
  extends ISingleEventTeamFromInitialValues {
  eventId: number;
}

interface SingleEventTeamPageFactoryProps {
  initialValues: ISingleEventTeamFromInitialValues;
  onFinish: (values: ISingleEventTeamFromFinishValues) => void;
}

const SingleEventTeamPageFactorySuccess: FC<
  SingleEventTeamPageFactoryProps
> = ({ initialValues, onFinish }) => {
  const { eventId } = useParams();
  const [form] = Form.useForm();

  const onFormFinish = (values: ISingleEventTeamFromFinishValues) => {
    onFinish({
      ...values,
      eventId: Number(
        getNotNil(eventId, "SingleEventTeamPageFactorySuccess -> onFormFinish"),
      ),
    });
  };

  return (
    <Flex style={{ padding: 16 }} gap={16} vertical>
      <BackButton
        path={generatePath(webappRoutes.manageSingleEventRoute, { eventId })}
      />
      <Form form={form} onFinish={onFormFinish} initialValues={initialValues}>
        <Form.Item name={"name"} label={"Name"} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name={"participantIds"} label={"Participants"}>
          <AddParticipants />
        </Form.Item>
        <Form.Item>
          <FixedButton htmlType={"submit"}>{"Submit"}</FixedButton>
        </Form.Item>
      </Form>
    </Flex>
  );
};

const SingleEventTeamPageFactory: FC<SingleEventTeamPageFactoryProps> = (
  props,
) => {
  return (
    <RequestStatusToComponent
      requestSymbol={EVENTS_GET_BY_ID_REQUEST_SYMBOL}
      SUCCESS={withProps(SingleEventTeamPageFactorySuccess)(props)}
    />
  );
};

export { SingleEventTeamPageFactory };
export type {
  ISingleEventTeamFromInitialValues,
  ISingleEventTeamFromFinishValues,
};
