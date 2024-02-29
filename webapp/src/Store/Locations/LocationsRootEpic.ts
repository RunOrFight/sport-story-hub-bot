import { combineEpics } from "redux-observable";
import { routerEpic } from "../RouterEpic.ts";
import { webappRoutes } from "../../../../src/constants/webappRoutes.ts";
import { TAppEpic } from "../App/Epics/TAppEpic.ts";
import { concat, from, of, switchMap } from "rxjs";
import { locationsSlice } from "./LocationsSlice.ts";

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

const locationsRootEpic = combineEpics(locationsRouterEpic);

export { locationsRootEpic };
