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

interface IUserInitResponse {
  user: User;
  isNewUser: boolean;
}

export type {
  IUserUpdatePayload,
  IUserStatisticUpdatePayload,
  IUserInitResponse,
};
