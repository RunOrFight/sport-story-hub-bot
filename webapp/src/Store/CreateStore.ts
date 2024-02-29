import { Action, configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./User/UserSlice.ts";
import { appEpic } from "./App/Epics/AppEpic.ts";
import { createEpicMiddleware } from "redux-observable";
import { httpApi } from "../httpApi.ts";
import {
  createRouterMiddleware,
  createRouterReducerMapObject,
} from "@lagunovsky/redux-react-router";
import { createBrowserHistory } from "history";
import { locationsSlice } from "./Locations/LocationsSlice.ts";

const history = createBrowserHistory();
const routerMiddleware = createRouterMiddleware(history);

export const createStore = () => {
  const epicMiddleware = createEpicMiddleware<Action, Action, any, any>({
    dependencies: { httpApi },
  });

  const store = configureStore({
    reducer: {
      ...createRouterReducerMapObject(history),
      user: userSlice.reducer,
      locations: locationsSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(routerMiddleware).concat(epicMiddleware),
  });

  epicMiddleware.run(appEpic);

  return store;
};

const store = createStore();

type AppState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export { store, history };
export type { AppState, AppDispatch };