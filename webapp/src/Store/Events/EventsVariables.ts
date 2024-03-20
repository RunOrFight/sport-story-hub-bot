import { createRequestSymbol } from "../RequestManager/CreateRequestSymbol.ts";

const EVENTS_GET_ALL_REQUEST_SYMBOL = createRequestSymbol("EVENTS_GET_ALL");
const EVENTS_GET_BY_ID_REQUEST_SYMBOL = createRequestSymbol("EVENTS_GET_BY_ID");
const EVENTS_CREATE_REQUEST_SYMBOL = createRequestSymbol("EVENTS_CREATE");
const EVENTS_UPDATE_REQUEST_SYMBOL = createRequestSymbol("EVENTS_UPDATE");
const EVENTS_DELETE_REQUEST_SYMBOL = createRequestSymbol("EVENTS_DELETE");
const DELETE_TEAM_PARTICIPANT_REQUEST_SYMBOL = createRequestSymbol(
  "DELETE_REQUEST_PARTICIPANT",
);
const UPDATE_EVENT_TEAM_REQUEST_SYMBOL =
  createRequestSymbol("UPDATE_EVENT_TEAM");
const CREATE_EVENT_TEAM_REQUEST_SYMBOL =
  createRequestSymbol("CREATE_EVENT_TEAM");

const DELETE_EVENT_TEAM_REQUEST_SYMBOL =
  createRequestSymbol("DELETE_EVENT_TEAM");

export {
  EVENTS_GET_ALL_REQUEST_SYMBOL,
  EVENTS_GET_BY_ID_REQUEST_SYMBOL,
  EVENTS_CREATE_REQUEST_SYMBOL,
  EVENTS_UPDATE_REQUEST_SYMBOL,
  EVENTS_DELETE_REQUEST_SYMBOL,
  DELETE_TEAM_PARTICIPANT_REQUEST_SYMBOL,
  UPDATE_EVENT_TEAM_REQUEST_SYMBOL,
  CREATE_EVENT_TEAM_REQUEST_SYMBOL,
  DELETE_EVENT_TEAM_REQUEST_SYMBOL,
};
