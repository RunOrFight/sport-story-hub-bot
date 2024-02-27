import { combineEpics } from "redux-observable";
import { userEpic } from "../../User/UserSlice.ts";
import { catchError } from "rxjs";
import { TAppEpic } from "./TAppEpic.ts";

const appEpic: TAppEpic = (action$, store$, dependencies) =>
  combineEpics(userEpic)(action$, store$, dependencies).pipe(
    catchError((error, source) => {
      console.error(error);
      return source;
    }),
  );

export { appEpic };
