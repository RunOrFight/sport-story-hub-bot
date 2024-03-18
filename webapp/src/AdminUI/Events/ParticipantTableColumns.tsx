import { ColumnsType } from "antd/es/table";
import { Participant } from "../../../../src/database/entities/Participant.ts";
import { Avatar, Typography } from "antd";
import { getUserFullName } from "../../Utils/GetUserFullName.ts";

const PARTICIPANT_TABLE_COLUMNS: ColumnsType<Participant> = [
  {
    title: "#",
    dataIndex: "user",
    render: ({ photo, id }) => {
      const fallback = `https://api.dicebear.com/7.x/miniavs/svg?seed=${id}`;
      return <Avatar size={44} src={photo ?? fallback} />;
    },
    width: 50,
    align: "center",
  },
  {
    title: "Username",
    dataIndex: "user",
    render: ({ username, name, surname }) => {
      return (
        <Typography>
          <Typography.Title level={5}>
            {getUserFullName(name, surname)}
          </Typography.Title>

          <Typography.Text>{username}</Typography.Text>
        </Typography>
      );
    },
  },
  {
    title: "Elo",
    dataIndex: ["user", "Elo"],
    align: "right",
  },
];

export { PARTICIPANT_TABLE_COLUMNS };
