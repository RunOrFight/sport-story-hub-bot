import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { type TUser } from "../../Models/TUser.ts";
import {
  IUserInitResponse,
  IUserInitResponseData,
  IUserUpdatePayload,
} from "../../../../src/types/user.types.ts";
import { IError } from "../../Models/IError.ts";
import { ESliceStatus } from "../ESliceStatus.ts";

interface IUserState {
  status: ESliceStatus;
  info: TUser | null;
  isNewUser: boolean;
  profilePage: TUser | null;
  error: string | null;
  profilePageStatus: ESliceStatus;
  profilePageError: string | null;
  updateStatus: ESliceStatus;
}

const initialState: IUserState = {
  status: ESliceStatus.idle,
  info: null,
  isNewUser: true,
  error: null,
  profilePage: null,
  profilePageError: null,
  profilePageStatus: ESliceStatus.idle,
  updateStatus: ESliceStatus.idle,
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
    profilePageStarted: (state) => {
      state.profilePageStatus = ESliceStatus.loading;
    },
    profilePageReceived: (
      state,
      { payload }: PayloadAction<IUserInitResponseData | IError>,
    ) => {
      if ("error" in payload) {
        state.profilePageError = payload.error;
        state.profilePageStatus = ESliceStatus.error;

        return;
      }

      state.profilePage = payload.user;
      state.profilePageStatus = ESliceStatus.success;
    },
    update: (state, _: PayloadAction<IUserUpdatePayload>) => {
      state.updateStatus = ESliceStatus.loading;
    },
    updateResult: (state, { payload }: PayloadAction<IError>) => {
      if ("error" in payload) {
        state.updateStatus = ESliceStatus.error;
        return;
      }
      state.updateStatus = ESliceStatus.success;
    },
    updateClear: (state) => {
      state.updateStatus = ESliceStatus.idle;
    },
  },
});

export { userSlice };
