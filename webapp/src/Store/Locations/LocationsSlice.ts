import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ESliceStatus } from "../ESliceStatus.ts";
import { Location } from "../../../../src/database/entities/Location.ts";
import {
  TLocationCreatePayload,
  TLocationDeletePayload,
  TLocationUpdatePayload,
} from "../../../../src/types/location.types.ts";

interface ILocationsState {
  status: ESliceStatus;
  updateStatus: ESliceStatus;
  createStatus: ESliceStatus;
  data: Location[];
}

const initialState: ILocationsState = {
  status: ESliceStatus.idle,
  updateStatus: ESliceStatus.idle,
  createStatus: ESliceStatus.idle,
  data: [],
};

const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    started: (state) => {
      state.status = ESliceStatus.loading;
    },
    received: (
      state,
      { payload }: PayloadAction<{ locations: Location[] }>,
    ) => {
      state.data = payload.locations;
      state.status = ESliceStatus.success;
    },
    error: (state) => {
      state.status = ESliceStatus.error;
    },
    update: (state, _: PayloadAction<TLocationUpdatePayload>) => {
      state.updateStatus = ESliceStatus.loading;
    },
    updateSuccess: (state) => {
      state.updateStatus = ESliceStatus.success;
    },
    updateError: (state) => {
      state.updateStatus = ESliceStatus.error;
    },
    updateClear: (state) => {
      state.updateStatus = ESliceStatus.idle;
    },
    create: (state, _: PayloadAction<TLocationCreatePayload>) => {
      state.createStatus = ESliceStatus.loading;
    },
    createSuccess: (state) => {
      state.createStatus = ESliceStatus.success;
    },
    createError: (state) => {
      state.createStatus = ESliceStatus.error;
    },
    createClear: (state) => {
      state.createStatus = ESliceStatus.idle;
    },
    delete: (state, _: PayloadAction<TLocationDeletePayload>) => {
      state.status = ESliceStatus.loading;
    },
  },
});

export { locationsSlice };
