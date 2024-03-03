import { User } from "../database/entities/User";

export type TUserUpdatePayload = {
  username: string;
  name?: string | null;
  surname?: string | null;
  photoId?: number | null;
};

export type TUserInitResponseData = {
  user: User;
  isNewUser: boolean;
};

export type TUserInitResponse = {
  data: TUserInitResponseData;
};
