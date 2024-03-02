import type { TAppEpic } from "../App/Epics/TAppEpic.ts";
import { concat, EMPTY, from, of, switchMap, take } from "rxjs";
import { userSlice } from "./UserSlice.ts";
import { combineEpics, ofType } from "redux-observable";
import { webappRoutes } from "../../../../src/constants/webappRoutes.ts";
import { getNotNil } from "../../Utils/GetNotNil.ts";
import { routerEpic } from "../RouterEpic.ts";
import { isDev } from "../../Utils/OneLineUtils.ts";

const userInitLoadEpic: TAppEpic = (_, state$, { httpApi }) =>
  state$.pipe(
    take(1),
    switchMap(() => {
      const username = isDev
        ? "@@admin@@"
        : Telegram.WebApp.initDataUnsafe.user?.username;

      if (!username) {
        return EMPTY;
      }

      return concat(
        of(userSlice.actions.started()),
        from(httpApi.getOrCreateUserByUsername(username)).pipe(
          switchMap((data) => of(userSlice.actions.received(data))),
        ),
      );
    }),
  );

const userRouterEpic = routerEpic(
  webappRoutes.profileRoute,
  (match) =>
    (_, __, { httpApi }) => {
      const id = getNotNil(match.params.id, "userRouterEpic");

      return concat(
        of(userSlice.actions.profilePageStarted()),
        from(httpApi.getUserById(Number(id))).pipe(
          switchMap((data) => of(userSlice.actions.profilePageReceived(data))),
        ),
      );
    },
);

const updateProfileRouterEpic = routerEpic(
  webappRoutes.updateProfileRoute,
  () =>
    (action$, __, { httpApi }) =>
      action$.pipe(
        ofType(userSlice.actions.update.type),
        switchMap((payload) =>
          from(httpApi.updateUser(payload)).pipe(
            switchMap((value) => of(userSlice.actions.updateResult(value))),
          ),
        ),
      ),
);

const userRootEpic = combineEpics(
  userInitLoadEpic,
  userRouterEpic,
  updateProfileRouterEpic,
);

export { userRootEpic };
