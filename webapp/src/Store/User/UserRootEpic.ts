import type { TAppEpic } from "../App/Epics/TAppEpic.ts";
import { concat, EMPTY, from, of, switchMap, take } from "rxjs";
import { userSlice } from "./UserSlice.ts";
import { combineEpics } from "redux-observable";
import { webappRoutes } from "../../../../src/constants/webappRoutes.ts";
import { getNotNil } from "../../Utils/GetNotNil.ts";
import { routerEpic } from "../RouterEpic.ts";

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

const userRouterEpic = routerEpic(
  webappRoutes.profileRoute,
  (match) => (action$, state$, dependencies) => {
    const username = getNotNil(match.params.username, "userRouterEpic");

    return userLoadEpicFactory(username)(action$, state$, dependencies);
  },
);

const userRootEpic = combineEpics(usesInitLoadEpic, userRouterEpic);

export { userRootEpic };
