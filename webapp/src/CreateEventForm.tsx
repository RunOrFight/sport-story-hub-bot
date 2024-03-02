import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Skeleton,
} from "antd";
import dayjs from "dayjs";
import { IEventLocation, IEventRaw } from "./types.ts";
import { useEffect, useState } from "react";
import "dayjs/locale/ru.js";
import { httpApi } from "./HttpApi/HttpApi.ts";

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

const CreateEventForm = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [locations, setLocations] = useState<IEventLocation[] | null>(null);
  const [form] = Form.useForm();

  const onFinish = async (values: ICreateEventFormValues) => {
    const dateTime = values.dateTime.locale("ru").toDate();

    Telegram.WebApp.sendData(
      JSON.stringify({
        ...values,
        dateTime,
      }),
    );

    messageApi.open(successMessage);
  };

  const onFinishFailed = () => {
    messageApi.open(errorMessage);
  };

  useEffect(() => {
    httpApi.getEventsLocations().then((response) => {
      console.log(response);
      const locations = response.locations;
      setLocations(locations);
      locations.length !== 0 &&
        form.setFieldValue("locationId", locations[0].id);
    });
  }, [form]);

  if (!locations) {
    return <Skeleton active />;
  }

  return (
    <>
      {contextHolder}
      <Form
        form={form}
        layout={"vertical"}
        name="basic"
        onFinish={onFinish}
        initialValues={initialValues}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        style={{ padding: 16 }}
      >
        <Form.Item<IEventRaw>
          label="Place"
          name="locationId"
          rules={[{ required: true }]}
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
    </>
  );
};

export { CreateEventForm };
