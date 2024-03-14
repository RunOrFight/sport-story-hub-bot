import { EGameEventType } from "../enums/game-event.enum";

export type TGameStatAddPayload = {
  type: EGameEventType;
  gameId: number;
  teamParticipantId: number;
  createdAt: Date;
};

export type TGameStatDeletePayload = {
  id: number;
};
