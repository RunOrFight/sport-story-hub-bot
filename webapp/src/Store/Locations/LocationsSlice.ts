import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ESliceStatus } from "../ESliceStatus.ts";
import { Location } from "../../../../src/database/entities/Location.ts";
import { TLocationUpdatePayload } from "../../../../src/types/location.types.ts";

interface ILocationsState {
  status: ESliceStatus;
  updateStatus: ESliceStatus;
  data: Location[];
}

const initialState: ILocationsState = {
  status: ESliceStatus.idle,
  updateStatus: ESliceStatus.idle,
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
  },
});

export { locationsSlice };
