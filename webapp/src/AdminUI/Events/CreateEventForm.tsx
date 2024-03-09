import { Button, DatePicker, Form, Input, InputNumber, Select } from "antd";
import dayjs from "dayjs";
import { IEventRaw } from "../../types.ts";
import "dayjs/locale/ru.js";
import { useDispatch, useSelector } from "react-redux";
import { locationsSelectors } from "../../Store/Locations/LocationsSelector.ts";
import { withProps } from "../../Utils/WithProps.ts";
import { RequestStatusToComponent } from "../../Components/RequestStatusToComponent.tsx";
import { LOCATIONS_GET_ALL_REQUEST_SYMBOL } from "../../Store/Locations/LocationsVariables.ts";
import { eventsSlice } from "../../Store/Events/EventsSlice.ts";

interface ICreateEventFormValues extends Omit<IEventRaw, "dateTime"> {
  dateTime: ReturnType<typeof dayjs>;
}

const initialValues = {
  participantsLimit: 10,
  price: "5 BYN",
  description: "Regular Match",
  dateTime: dayjs(Date.now()).locale("ru"),
};

const successMessage = {
  type: "success",
  content: "Event created",
} as const;

const errorMessage = {
  type: "error",
  content: "Something went wrong",
} as const;

const CreateEventFormSuccess = () => {
  const locations = useSelector(locationsSelectors.data);
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onFinish = async (values: ICreateEventFormValues) => {
    const dateTime = values.dateTime.locale("ru").toDate();

    dispatch(eventsSlice.actions.create({ ...values, dateTime }));
  };

  return (
    <Form
      form={form}
      layout={"vertical"}
      name="basic"
      onFinish={onFinish}
      initialValues={initialValues}
      autoComplete="off"
      style={{ padding: 16 }}
    >
      <Form.Item<IEventRaw>
        label="Place"
        name="locationId"
        rules={[{ required: true }]}
        initialValue={locations[0].id}
      >
        <Select
          allowClear
          options={locations}
          fieldNames={{ label: "title", value: "id" }}
        />
      </Form.Item>

      <Form.Item<IEventRaw>
        label="Date"
        name="dateTime"
        rules={[{ required: true }]}
      >
        <DatePicker
          format={"YYYY-MM-DD HH:mm:ss"}
          showTime
          style={{ width: "100%" }}
        />
      </Form.Item>

      <Form.Item<IEventRaw>
        label="Price"
        name="price"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<IEventRaw>
        label="Participants Limit"
        name="participantsLimit"
        rules={[{ required: true }]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item<IEventRaw>
        label="Description"
        name="description"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

const CreateEventForm = withProps(RequestStatusToComponent)({
  requestSymbol: LOCATIONS_GET_ALL_REQUEST_SYMBOL,
  SUCCESS: CreateEventFormSuccess,
});

export { CreateEventForm };
