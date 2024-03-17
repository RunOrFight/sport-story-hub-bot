import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IWithEvent, TEvent } from "../../Models/TEvent.ts";
import {
  IGetAllEventsResponse,
  type IUpdateEventResponse,
} from "../../HttpApi/HttpApiTypes.ts";
import {
  TEventCreatePayload,
  TEventDeletePayload,
  TEventUpdatePayload,
} from "../../../../src/types/event.types.ts";
import { getNotNil } from "../../Utils/GetNotNil.ts";
import { TTeamParticipantDeletePayload } from "../../../../src/types/team-participant.types.ts";

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
    updated: (_, __: PayloadAction<IUpdateEventResponse>) => {},
    delete: (_, __: PayloadAction<TEventDeletePayload>) => {},
    deleted: (_, __: PayloadAction<boolean>) => {},
    deleteTeamParticipant: (
      _,
      __: PayloadAction<TTeamParticipantDeletePayload>,
    ) => {},
  },
  selectors: {
    edges: (sliceState) => sliceState.edges,
    singleEventNotNil: (sliceState) =>
      getNotNil(sliceState.singleEvent, "singleEventNotNilSelector"),
  },
});

export { eventsSlice };
