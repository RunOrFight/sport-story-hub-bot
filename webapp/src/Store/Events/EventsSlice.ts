import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IWithEvent, TEvent } from "../../Models/TEvent.ts";
import { IGetAllEventsResponse } from "../../HttpApi/HttpApiTypes.ts";
import {
  TEventCreatePayload,
  TEventUpdatePayload,
} from "../../../../src/types/event.types.ts";
import { getNotNil } from "../../Utils/GetNotNil.ts";

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
    singleEventReceived: (state, { payload }: PayloadAction<IWithEvent>) => {
      state.singleEvent = payload.event;
    },
    create: (_, __: PayloadAction<TEventCreatePayload>) => {},
    update: (_, __: PayloadAction<TEventUpdatePayload>) => {},
  },
  selectors: {
    edges: (sliceState) => sliceState.edges,
    singleEventNotNil: (sliceState) =>
      getNotNil(sliceState.singleEvent, "singleEventNotNilSelector"),
  },
});

export { eventsSlice };
