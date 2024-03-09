import { combineEpics, ofType } from "redux-observable";
import { routerEpic } from "../../Utils/RouterEpic.ts";
import { webappRoutes } from "../../../../../src/constants/webappRoutes.ts";
import { TAppEpic } from "../../App/Epics/TAppEpic.ts";
import { catchError, delay, from, of, switchMap } from "rxjs";
import { locationsSlice } from "../LocationsSlice.ts";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  TLocationCreatePayload,
  TLocationDeletePayload,
  TLocationUpdatePayload,
} from "../../../../../src/types/location.types.ts";
import { locationsLoadEpic } from "./LocationsLoadEpic.ts";

const deleteLocationEpic: TAppEpic = (action$, state$, dependencies) =>
  action$.pipe(
    ofType("locations/delete"),
    switchMap(({ payload }: PayloadAction<TLocationDeletePayload>) => {
      return from(dependencies.httpApi.deleteLocation(payload)).pipe(
        delay(500),
        switchMap(() => locationsLoadEpic(action$, state$, dependencies)),
      );
    }),
  );

const locationsRouterEpic = routerEpic(webappRoutes.locationsRoute, () =>
  combineEpics(locationsLoadEpic, deleteLocationEpic),
);

const updateLocationEpic: TAppEpic = (action$, _, dependencies) =>
  action$.pipe(
    ofType("locations/update"),
    switchMap(({ payload }: PayloadAction<TLocationUpdatePayload>) => {
      return from(dependencies.httpApi.updateLocation(payload)).pipe(
        () => of(locationsSlice.actions.updateSuccess()),
        catchError(() => of(locationsSlice.actions.updateError())),
      );
    }),
  );

const updateLocationRouterEpic = routerEpic(
  webappRoutes.updateLocationRoute,
  () => updateLocationEpic,
);

const createLocationEpic: TAppEpic = (action$, _, dependencies) =>
  action$.pipe(
    ofType("locations/create"),
    switchMap(({ payload }: PayloadAction<TLocationCreatePayload>) => {
      return from(dependencies.httpApi.createLocation(payload)).pipe(
        () => of(locationsSlice.actions.createSuccess()),
        catchError(() => of(locationsSlice.actions.createError())),
      );
    }),
  );

const createLocationRouterEpic = routerEpic(
  webappRoutes.createLocationRoute,
  () => createLocationEpic,
);

const locationsRootEpic = combineEpics(
  locationsRouterEpic,
  updateLocationRouterEpic,
  createLocationRouterEpic,
);

export { locationsRootEpic };
