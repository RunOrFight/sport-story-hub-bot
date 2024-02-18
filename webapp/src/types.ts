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

enum EEventStatus {
  WAITING = "waiting",
  STARTED = "started",
  FINISHED = "finished",
}

interface IUser {
  username: string;
  photo: IFile;
}

interface IEventParticipant {
  id: number;
  user: IUser;
}

interface IEventRaw {
  locationId: number;
  dateTime: string;
  description: string;
  price: string;
  participantsLimit: number;
}

interface IEventFull extends Omit<IEventRaw, "locationId"> {
  location: IEventLocation;
  participants: IEventParticipant[];
  id: number;
  status: EEventStatus;
}

export type { IEventRaw, IEventFull, IEventLocation, IUser };
export { EEventStatus };
