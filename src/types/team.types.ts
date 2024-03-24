export type TTeamCreatePayload = {
  name: string;
  eventId: number;
  participantIds?: number[];
};

export type TTeamUpdatePayload = {
  id: number;
  name?: string;
  participantIds?: number[];
};

export type TTeamDeletePayload = {
  id: number;
};
