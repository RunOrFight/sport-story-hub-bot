type TUnknownObject = Record<string, unknown>

type TAnyPromiseFunction = (...args: any[]) => Promise<any>

interface IEvent {
    id: string;
    date: Date;
    price: number | string;
    place: string;
    participantsCount: number | string
}

interface IEventWithParticipants extends IEvent {
    participants: string[]
}

export type {IEvent, IEventWithParticipants, TUnknownObject, TAnyPromiseFunction}
