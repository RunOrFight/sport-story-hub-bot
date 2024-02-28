import { EEventStatus } from "./enums/event-status.enum";

type TUnknownObject = Record<string, unknown>;

type TAnyPromiseFunction = (...args: any[]) => Promise<any>;

interface IFile {
  id: number;
  url: string;
}

interface IEventLocation {
  id: number;
  title: string;
  url: string;
  address: string;
  preview: IFile;
}

interface IUser {
  username: string;
  photo?: IFile;
}

interface IEventParticipant {
  id: number;
  user: IUser;
}

interface IEventRaw {
  locationId?: number;
  dateTime?: string;
  description?: string;
  price?: string;
  participantsLimit?: number;
}

interface IEventFull extends Omit<IEventRaw, "locationId"> {
  location: IEventLocation;
  participants: IEventParticipant[];
  id: number;
  status: EEventStatus;
  waitList: IUser[];
}

export type {
  IEventRaw,
  IEventFull,
  IEventLocation,
  TUnknownObject,
  TAnyPromiseFunction,
  IUser,
};
