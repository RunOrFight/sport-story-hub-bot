import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ESliceStatus } from "../ESliceStatus.ts";
import { Location } from "../../../../src/database/entities/Location.ts";

interface ILocationsState {
  status: ESliceStatus;
  data: Location[];
}

const initialState: ILocationsState = {
  status: ESliceStatus.idle,
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
  },
});

export { locationsSlice };
