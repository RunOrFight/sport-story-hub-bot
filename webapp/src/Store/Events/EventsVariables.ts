import { createRequestSymbol } from "../RequestManager/CreateRequestSymbol.ts";

const EVENTS_GET_ALL_REQUEST_SYMBOL = createRequestSymbol("EVENTS_GET_ALL");
const EVENTS_GET_BY_ID_REQUEST_SYMBOL = createRequestSymbol("EVENTS_GET_BY_ID");
const EVENTS_CREATE_REQUEST_SYMBOL = createRequestSymbol("EVENTS_CREATE");

export {
  EVENTS_GET_ALL_REQUEST_SYMBOL,
  EVENTS_GET_BY_ID_REQUEST_SYMBOL,
  EVENTS_CREATE_REQUEST_SYMBOL,
};
