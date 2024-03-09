import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TEvent } from "../../Models/TEvent.ts";
import { IGetAllEventsResponse } from "../../HttpApi/HttpApiTypes.ts";
import { TEventCreatePayload } from "../../../../src/types/event.types.ts";

interface IEventsSlice {
  edges: TEvent[];
  singleEvent: TEvent | null;
}

const initialState: IEventsSlice = {
  edges: [],
  singleEvent: null,
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    received: (state, { payload }: PayloadAction<IGetAllEventsResponse>) => {
      state.edges = payload.events;
    },
    singleEventReceived: (state, { payload }: PayloadAction<TEvent>) => {
      state.singleEvent = payload;
    },
    create: (_, __: PayloadAction<TEventCreatePayload>) => {},
  },
  selectors: {
    edges: (sliceState) => sliceState.edges,
  },
});

export { eventsSlice };
