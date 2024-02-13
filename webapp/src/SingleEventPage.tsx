import {useEffect, useState} from "react";
import {Link, useParams} from "react-router-dom";
import {httpApi} from "./httpApi.ts";
import {IEventFull, IUser} from "./types.ts";
import {Flex, Image, Skeleton, Table} from "antd";
import {CalendarOutlined} from "@ant-design/icons";
import Title from "antd/lib/typography/Title";
import Paragraph from "antd/lib/typography/Paragraph";

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Username',
        dataIndex: 'user',
        key: 'user',
        render: (user: IUser) => user.username
    },
]

const SingleEventPage = () => {
    const params = useParams()
    const [event, setEvent] = useState<IEventFull>()

    useEffect(() => {
        httpApi.getEventById(Number(params.id)).then((event) => {
            setEvent(event)
        })

    }, [params])

    if (!event) {
        return <Skeleton active/>
    }


    return <Flex vertical gap={"small"}>
        <Link to={".."}>{"Back"}</Link>
        <Image height={200} width={"100%"} style={{objectFit: "cover"}} src={event.location.preview.url}
               alt={"preview"}/>
        <Flex align={"center"} gap={"middle"}>
            <CalendarOutlined style={{fontSize: 30}}/>
            <Title level={3}>{event.dateTime}</Title>
        </Flex>


        <Paragraph>
            {event.description}
        </Paragraph>

        {
            event.participants.length !== 0 ? <Title level={3}>
                {`Participants(${event.participants.length}/${event.participantsLimit})`}
            </Title> : null
        }


        <Table columns={columns} pagination={false} dataSource={event.participants}/>
    </Flex>
}

export {SingleEventPage}
