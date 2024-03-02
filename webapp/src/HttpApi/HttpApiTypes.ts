import { TEvent } from "../Models/TEvent.ts";
import { Location } from "../../../src/database/entities/Location.ts";

interface IGetAllEventsResponse {
  events: TEvent[];
}

interface IGetAllLocationsResponse {
  locations: Location[];
}

export type { IGetAllEventsResponse, IGetAllLocationsResponse };
