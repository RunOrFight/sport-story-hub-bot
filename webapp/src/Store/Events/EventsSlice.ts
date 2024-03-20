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
import {
  TTeamCreatePayload,
  TTeamDeletePayload,
  TTeamUpdatePayload,
} from "../../../../src/types/team.types.ts";

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
    createSingleEventTeam: (_, __: PayloadAction<TTeamCreatePayload>) => {},
    updateSingleEventTeam: (_, __: PayloadAction<TTeamUpdatePayload>) => {},
    deleteSingleEventTeam: (_, __: PayloadAction<TTeamDeletePayload>) => {},
  },
  selectors: {
    edges: (sliceState) => sliceState.edges,
    singleEventNotNil: (sliceState) =>
      getNotNil(sliceState.singleEvent, "singleEventNotNilSelector"),
    singleEventParticipants: (sliceState) => {
      const event = getNotNil(
        sliceState.singleEvent,
        "singleEventParticipants -> event",
      );

      return event.participants;
    },
    singleEventTeamByIdNotNil: (sliceState, id: number) => {
      const event = getNotNil(
        sliceState.singleEvent,
        "singleEventTeamById -> event",
      );

      return getNotNil(
        event.teams.find((it) => it.id === id),
        "singleEventTeamById -> event.teams.find",
      );
    },
  },
});

export { eventsSlice };
