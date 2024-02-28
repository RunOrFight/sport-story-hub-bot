import { IEventRaw, TUnknownObject } from "./types";
import { TEventCreatePayload } from "../../types/event.types";

const isObject = (candidate: unknown): candidate is TUnknownObject =>
  candidate !== null && typeof candidate === "object";

const checkAsObject = <T>(candidate: unknown, propertiesList: string[]) => {
  if (!isObject(candidate)) {
    throw `checkAsObject -> ${JSON.stringify(candidate)} is not object`;
  }

  propertiesList.forEach((property) => {
    if (!(property in candidate)) {
      throw `checkAsObject -> candidate has no property: <${property}>`;
    }
  });
  return candidate as T;
};

const assertIsRawEvent = (maybeEvent: unknown) => {
  return checkAsObject<TEventCreatePayload>(maybeEvent, [
    "locationId",
    "dateTime",
    "description",
    "price",
    "participantsLimit",
  ]);
};

export { assertIsRawEvent };
