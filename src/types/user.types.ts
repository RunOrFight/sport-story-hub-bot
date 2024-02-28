import { EStatisticProperty } from "../enums/statistic-propery-enum";
import { User } from "../database/entities/User";

interface IUserUpdatePayload {
  username: string;
  name?: string | null;
  surname?: string | null;
}

interface IUserStatisticUpdatePayload {
  id: number;
  type: EStatisticProperty;
}

interface IUserInitResponseData {
  user: User;
  isNewUser: boolean;
}

interface IUserInitResponse {
  data: IUserInitResponseData;
}

export type {
  IUserUpdatePayload,
  IUserStatisticUpdatePayload,
  IUserInitResponseData,
  IUserInitResponse,
};
