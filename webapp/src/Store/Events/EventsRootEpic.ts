import { combineEpics } from "redux-observable";
import { routerEpic } from "../Utils/RouterEpic.ts";
import { webappRoutes } from "../../../../src/constants/webappRoutes.ts";
import { httpRequestEpicFactory } from "../Utils/HttpRequestEpicFactory.ts";
import { TAppEpic } from "../App/Epics/TAppEpic.ts";
import { EVENTS_GET_ALL_REQUEST_SYMBOL } from "./EventsVariables.ts";
import { eventsSlice } from "./EventsSlice.ts";

const loadEventsEpic: TAppEpic = (_, __, { httpApi }) =>
  httpRequestEpicFactory({
    input: httpApi.getAllEvents(),
    requestSymbol: EVENTS_GET_ALL_REQUEST_SYMBOL,
    receivedActionCreator: eventsSlice.actions.received,
  });

const manageEventsRouterEpic = routerEpic(
  webappRoutes.manageEventsRoute,
  () => loadEventsEpic,
);

const clientEventsRouterEpic = routerEpic(
  webappRoutes.eventsRoute,
  () => loadEventsEpic,
);

const eventsRootEpic = combineEpics(
  manageEventsRouterEpic,
  clientEventsRouterEpic,
);

export { eventsRootEpic };
