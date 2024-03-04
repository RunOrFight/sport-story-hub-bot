import { EEventStatus } from "../enums/event-status.enum";

export type TEventCreatePayload = {
  dateTime?: Date;
  price?: string;
  participantsLimit?: number;
  description?: string;
  locationId?: number;
};

export type TEventUpdatePayload = {
  id: number;
  dateTime?: Date | null;
  price?: string | null;
  participantsLimit?: number | null;
  description?: string | null;
  locationId?: number | null;
  status?: EEventStatus;
};

export type TEventDeletePayload = {
  id: number;
};

export type TEventParticipantJoin = { eventId: number; username: string };
export type TEventParticipantLeave = { eventId: number; username: string };
