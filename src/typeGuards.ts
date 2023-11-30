import {IEventRaw, TUnknownObject} from "./types";

const isObject = (candidate: unknown): candidate is TUnknownObject => candidate !== null && typeof candidate === "object"

const checkAsObject = <T>(candidate: unknown, propertiesList: string[]) => {
    if (!isObject(candidate)) {
        throw `checkAsObject -> ${JSON.stringify(candidate)} is not object`
    }

    propertiesList.forEach((property) => {
        if (!(property in candidate)) {
            throw `checkAsObject -> property: ${property} isn't in candidate: ${JSON.stringify(candidate)}`
        }
    })

    return candidate as T
}

const assertIsRawEvent = (maybeEvent: unknown) => {
    return checkAsObject<IEventRaw>(maybeEvent, ["locationId", "dateTime", "description", "price", "participantsLimit"])
}

export {assertIsRawEvent}
