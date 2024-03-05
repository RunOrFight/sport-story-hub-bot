export type TGameCreatePayload = {
  name: string;
  eventId: number;
  teamIds: number[];
};

export type TGameUpdatePayload = {
  id: number;
  name?: string;
  teamIds?: number[];
};

export type TGameDeletePayload = {
  id: number;
};
