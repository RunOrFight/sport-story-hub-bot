import { combineEpics, ofType } from "redux-observable";
import { routerEpic } from "../RouterEpic.ts";
import { webappRoutes } from "../../../../src/constants/webappRoutes.ts";
import { TAppEpic } from "../App/Epics/TAppEpic.ts";
import { catchError, concat, from, of, switchMap } from "rxjs";
import { locationsSlice } from "./LocationsSlice.ts";
import { PayloadAction } from "@reduxjs/toolkit";
import { TLocationUpdatePayload } from "../../../../src/types/location.types.ts";

const locationsLoadEpic: TAppEpic = (_, __, { httpApi }) => {
  return concat(
    of(locationsSlice.actions.started()),
    from(httpApi.getAllLocations()).pipe(
      switchMap((data) => of(locationsSlice.actions.received(data))),
    ),
  );
};

const locationsRouterEpic = routerEpic(webappRoutes.locationsRoute, () =>
  combineEpics(locationsLoadEpic),
);

const updateLocationEpic: TAppEpic = (action$, state$, dependencies) =>
  action$.pipe(
    ofType("locations/update"),
    switchMap(({ payload }: PayloadAction<TLocationUpdatePayload>) => {
      return concat(
        from(dependencies.httpApi.updateLocation(payload)).pipe(
          () => of(locationsSlice.actions.updateSuccess()),
          catchError(() => of(locationsSlice.actions.updateError())),
        ),
        locationsLoadEpic(action$, state$, dependencies),
      );
    }),
  );

const updateLocationRouterEpic = routerEpic(
  webappRoutes.updateLocationRoute,
  () => updateLocationEpic,
);

const locationsRootEpic = combineEpics(
  locationsRouterEpic,
  updateLocationRouterEpic,
);

export { locationsRootEpic };
