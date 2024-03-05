import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TEvent } from "../../Models/TEvent.ts";
import { IGetAllEventsResponse } from "../../HttpApi/HttpApiTypes.ts";

interface IEventsSlice {
  edges: TEvent[];
}

const initialState: IEventsSlice = {
  edges: [],
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    received: (state, { payload }: PayloadAction<IGetAllEventsResponse>) => {
      state.edges = payload.events;
    },
  },
  selectors: {
    edges: (sliceState) => sliceState.edges,
  },
});

export { eventsSlice };
