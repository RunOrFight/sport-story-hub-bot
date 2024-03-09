import { combineEpics } from "redux-observable";
import { routerEpic } from "../Utils/RouterEpic.ts";
import { webappRoutes } from "../../../../src/constants/webappRoutes.ts";
import { httpRequestEpicFactory } from "../Utils/HttpRequestEpicFactory.ts";
import { TAppEpic } from "../App/Epics/TAppEpic.ts";
import {
  EVENTS_GET_ALL_REQUEST_SYMBOL,
  EVENTS_GET_BY_ID_REQUEST_SYMBOL,
} from "./EventsVariables.ts";
import { eventsSlice } from "./EventsSlice.ts";
import { httpApi } from "../../HttpApi/HttpApi.ts";
import { locationsLoadEpic } from "../Locations/Epics/LocationsLoadEpic.ts";
import { EMPTY, switchMap, tap } from "rxjs";
import { fromActionCreator } from "../Utils/FromActionCreator.ts";

const loadEventsEpic: TAppEpic = (_, __, { httpApi }) =>
  httpRequestEpicFactory({
    input: httpApi.getAllEvents(),
    requestSymbol: EVENTS_GET_ALL_REQUEST_SYMBOL,
    receivedActionCreator: eventsSlice.actions.received,
  });

const loadEventByIdEpic = (eventId: string) => () =>
  httpRequestEpicFactory({
    input: httpApi.getEventById(eventId),
    requestSymbol: EVENTS_GET_BY_ID_REQUEST_SYMBOL,
    receivedActionCreator: eventsSlice.actions.singleEventReceived,
  });

const createEventEpic: TAppEpic = (action$) =>
  action$.pipe(
    fromActionCreator(eventsSlice.actions.create),
    tap((action) => {
      Telegram.WebApp.sendData(JSON.stringify(action.payload));
    }),
    switchMap(
      () => EMPTY,
      // httpRequestEpicFactory({
      //   input: httpApi.createEvent(action.payload),
      //   requestSymbol: EVENTS_CREATE_REQUEST_SYMBOL,
      // }),
    ),
  );

const createEventRouterEpic = routerEpic(webappRoutes.createEventRoute, () =>
  combineEpics(locationsLoadEpic, createEventEpic),
);

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
  createEventRouterEpic,
  clientEventsRouterEpic,
);

export { eventsRootEpic };
