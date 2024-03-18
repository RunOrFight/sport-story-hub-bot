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
import {
  TTeamParticipantAddPayload,
  TTeamParticipantDeletePayload,
} from "../../../../src/types/team-participant.types.ts";

interface IEventsSlice {
  edges: TEvent[];
  singleEvent: TEvent | null;
  teamParticipantSearchString: string;
  selectedTeamParticipantIds: number[];
}

const initialState: IEventsSlice = {
  edges: [],
  singleEvent: null,
  teamParticipantSearchString: "",
  selectedTeamParticipantIds: [],
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
    searchTeamParticipant: (state, { payload }: PayloadAction<string>) => {
      state.teamParticipantSearchString = payload;
    },
    selectTeamParticipantIds: (state, { payload }: PayloadAction<number[]>) => {
      state.selectedTeamParticipantIds = payload;
    },
    addTeamParticipant: (
      _,
      __: PayloadAction<TTeamParticipantAddPayload>,
    ) => {},
  },
  selectors: {
    edges: (sliceState) => sliceState.edges,
    singleEventNotNil: (sliceState) =>
      getNotNil(sliceState.singleEvent, "singleEventNotNilSelector"),
    potentialTeamParticipantsBySearchString: (sliceState, teamId: number) => {
      const event = getNotNil(
        sliceState.singleEvent,
        "singleEventNotNilSelector -> event",
      );

      const team = getNotNil(
        event.teams.find((it) => it.id === teamId),
        "singleEventNotNilSelector -> team",
      );

      const filtered = event.participants.filter(({ user }) => {
        return !team.teamsParticipants.find(
          (it) => it.participant?.user?.username === user?.username,
        );
      });

      return filtered.filter(
        ({ user }) =>
          user?.username
            .toLowerCase()
            .includes(sliceState.teamParticipantSearchString.toLowerCase()) ||
          user?.name
            ?.toLowerCase()
            .includes(sliceState.teamParticipantSearchString.toLowerCase()),
      );
    },
    teamParticipantSearchString: (sliceState) =>
      sliceState.teamParticipantSearchString,
    selectedTeamParticipantIds: (sliceState) =>
      sliceState.selectedTeamParticipantIds,
  },
});

export { eventsSlice };
