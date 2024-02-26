import { EStatisticProperty } from "../enums/statistic-propery-enum";

export type TUserUpdatePayload = {
  username: string;
  name?: string | null;
  surname?: string | null;
};

export interface TUserStatisticUpdatePayload {
  id: number;
  type: EStatisticProperty;
}
