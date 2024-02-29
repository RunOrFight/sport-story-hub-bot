import type { TAppEpic } from "../App/Epics/TAppEpic.ts";
import {
  concat,
  distinctUntilChanged,
  EMPTY,
  from,
  map,
  of,
  switchMap,
  take,
} from "rxjs";
import { userSlice } from "./UserSlice.ts";
import { combineEpics } from "redux-observable";
import { routerLocationPathnameSelector } from "../Router/RouterSelectors.ts";
import { matchPath } from "react-router-dom";
import { EWebappRoutes } from "../../../../src/enums/webapp-routes.enum.ts";
import { getNotNil } from "../../Utils/GetNotNil.ts";

const userLoadEpicFactory =
  (username: string): TAppEpic =>
  (_, __, { httpApi }) => {
    return concat(
      of(userSlice.actions.started()),
      from(httpApi.getOrCreateUserByUsername(username)).pipe(
        switchMap((data) => of(userSlice.actions.received(data))),
      ),
    );
  };

const usesInitLoadEpic: TAppEpic = (action$, state$, dependencies) =>
  state$.pipe(
    take(1),
    switchMap(() => {
      const username = Telegram.WebApp.initDataUnsafe.user?.username;

      if (!username) {
        return EMPTY;
      }

      return userLoadEpicFactory(username)(action$, state$, dependencies);
    }),
  );

const userRouterEpic: TAppEpic = (action$, state$, dependencies) =>
  state$.pipe(
    map(routerLocationPathnameSelector),
    distinctUntilChanged(),
    switchMap((pathname) => {
      const match = matchPath(EWebappRoutes.profileRoute, pathname);

      if (!match) {
        return EMPTY;
      }

      const username = getNotNil(match.params.username, "userRouterEpic");

      return userLoadEpicFactory(username)(action$, state$, dependencies);
    }),
  );

const userRootEpic = combineEpics(usesInitLoadEpic, userRouterEpic);

export { userRootEpic };
