export type TTeamCreatePayload = {
  name: string;
  eventId: number;
};

export type TTeamUpdatePayload = {
  id: number;
  name?: string;
  eventId?: number;
};

export type TTeamDeletePayload = {
  id: number;
};
