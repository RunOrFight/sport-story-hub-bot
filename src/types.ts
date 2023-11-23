type TUnknownObject = Record<string, unknown>

type TAnyPromiseFunction = (...args: any[]) => Promise<any>

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

export type {IEvent, IEventWithParticipants, TUnknownObject, TAnyPromiseFunction}
