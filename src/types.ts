type TUnknownObject = Record<string, unknown>

interface IEvent {
    id: string;
    date: string;
    price: string;
    place: string;
    participantsCount: string
}

interface IEventWithParticipants extends IEvent {
    participants: string[]
}

export {type IEvent, type IEventWithParticipants, type TUnknownObject}
