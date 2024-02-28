import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { type TUser } from "../../Models/TUser.ts";
import { IUserInitResponse } from "../../../../src/types/user.types.ts";
import { IError } from "../../Models/IError.ts";
import { ESliceStatus } from "../ESliceStatus.ts";

interface IUserState {
  status: ESliceStatus;
  info: TUser | null;
  isNewUser: boolean;
  error: string | null;
}

const initialState: IUserState = {
  status: ESliceStatus.idle,
  info: null,
  isNewUser: true,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    started: (state) => {
      state.status = ESliceStatus.loading;
    },
    received: (
      state,
      { payload }: PayloadAction<IUserInitResponse | IError>,
    ) => {
      if ("error" in payload) {
        state.error = payload.error;
        state.status = ESliceStatus.error;

        return;
      }

      state.info = payload.data.user;
      state.status = ESliceStatus.success;
      state.isNewUser = payload.data.isNewUser;
    },
  },
});

export { userSlice };
