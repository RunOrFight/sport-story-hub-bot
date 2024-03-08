import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const CreateButton = ({}) => {
  return (
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
  );
};

export { CreateButton };
