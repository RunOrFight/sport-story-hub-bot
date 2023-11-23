import {IEvent, TUnknownObject} from "./types";

const isObject = (candidate: unknown): candidate is TUnknownObject => candidate !== null && typeof candidate === "object"

const isEvent = (maybeEvent: unknown): maybeEvent is IEvent => {
    return isObject(maybeEvent) && "id" in maybeEvent &&
        "date" in maybeEvent && "price" in maybeEvent &&
        "place" in maybeEvent && "participantsCount" in maybeEvent
}

export {isEvent}
