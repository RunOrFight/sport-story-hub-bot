import { useSelector } from "react-redux";
import { locationsSelectors } from "../../Store/Locations/LocationsSelector.ts";
import {
  Button,
  DatePicker,
  Flex,
  Form,
  Input,
  InputNumber,
  Select,
} from "antd";
import dayjs from "dayjs";
import { FC } from "react";
import { withProps } from "../../Utils/WithProps.ts";
import { RequestStatusToComponent } from "../../Components/RequestStatusToComponent.tsx";
import { LOCATIONS_GET_ALL_REQUEST_SYMBOL } from "../../Store/Locations/LocationsVariables.ts";
import { EEventStatus } from "../../../../src/enums/event-status.enum.ts";
import {
  EVENT_STATUSES,
  IEventFormFinishValues,
  IEventFormInitialValues,
  IEventFormValues,
} from "./EventsCommon.ts";
import { BackButton } from "../../Components/BackButton.tsx";

interface IEventFormFactoryProps {
  initialValues?: IEventFormInitialValues;
  onFinish: (values: IEventFormFinishValues) => void;
  backPath?: string;
}

const EventFormFactorySuccess: FC<IEventFormFactoryProps> = ({
  initialValues,
  onFinish,
  backPath,
}) => {
  const locations = useSelector(locationsSelectors.data);
  const [form] = Form.useForm();

  const onFormFinish = async ({ dateTime, ...values }: IEventFormValues) => {
    const formatted = dateTime.locale("ru").toDate();

    onFinish({ dateTime: formatted, ...values });
  };

  const formInitialValues: IEventFormValues = {
    locationId: initialValues?.location?.id ?? locations[0].id,
    dateTime: dayjs(initialValues?.dateTime || new Date()),
    participantsLimit: initialValues?.participantsLimit ?? 10,
    price: initialValues?.price ?? "",
    description: initialValues?.description ?? "",
    status: initialValues?.status ?? EEventStatus.WAITING,
  };

  return (
    <Flex style={{ padding: 16 }} vertical>
      <BackButton path={backPath} />
      <Form<IEventFormValues>
        form={form}
        layout={"vertical"}
        name="basic"
        onFinish={onFormFinish}
        autoComplete="off"
        initialValues={formInitialValues}
      >
        <Form.Item label="Place" name="locationId" rules={[{ required: true }]}>
          <Select
            allowClear
            options={locations}
            fieldNames={{ label: "title", value: "id" }}
          />
        </Form.Item>

        <Form.Item label="Date" name="dateTime" rules={[{ required: true }]}>
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Price" name="price" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="Participants Limit"
          name="participantsLimit"
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label={"Status"} name={"status"}>
          <Select
            options={EVENT_STATUSES}
            fieldNames={{ label: "title", value: "value" }}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

const EventFormFactory: FC<IEventFormFactoryProps> = (props) => {
  return (
    <RequestStatusToComponent
      requestSymbol={LOCATIONS_GET_ALL_REQUEST_SYMBOL}
      SUCCESS={withProps(EventFormFactorySuccess)(props)}
    />
  );
};

export { EventFormFactory };
