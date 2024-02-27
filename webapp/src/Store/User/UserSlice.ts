import { createSlice } from "@reduxjs/toolkit";
import { type TUser } from "../../Models/TUser.ts";
import { type TAppEpic } from "../App/Epics/TAppEpic.ts";
import { EMPTY, switchMap, tap } from "rxjs";

interface IUserState {
  user: TUser | null;
  isNewUser: boolean;
}

const initialState: IUserState = {
  user: null,
  isNewUser: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    received: () => {},
  },
});

const userEpic: TAppEpic = (_, state$) =>
  state$.pipe(
    tap(() => {
      console.log(state$.value);
    }),
    switchMap(() => {
      return EMPTY;
    }),
  );

export { userSlice, userEpic };
