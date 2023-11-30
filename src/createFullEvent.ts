import {IEventFull, IEventLocation, IEventRaw,} from "./types";
import {EEventStatus} from "./enums/EventStatus";

//todo
const getLocationById = (_locationId: number): IEventLocation => {
    return {
        id: 234,
        title: "Box365",
        url: "https://maps.app.goo.gl/ZeLrHS4BzczpcHAD7",
        address: "ул. Октябрьская 16/3, Минск",
        preview: {
            id: 1,
            url: "https://images.prismic.io/box365/ada297cd-86e6-45a1-b9be-cc20376c8f51_D75_5384+copy-min.jpg?auto=compress,format&rect=445,0,4016,4016&w=1200&h=1200"
        }
    }
}

let eventId = 1

const createFullEvent = ({dateTime, price, participantsLimit, description, locationId}: IEventRaw): IEventFull => {
    const location = getLocationById(locationId)

    eventId++

    return {
        id: eventId,
        location,
        price,
        participantsLimit,
        dateTime,
        description,
        status: EEventStatus.WAITING,
        participants: [],
        waitList: []
    }
}

export {createFullEvent}
