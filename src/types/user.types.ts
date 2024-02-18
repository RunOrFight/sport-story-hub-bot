import { EStatisticProperty } from "../enums/statistic-propery-enum";

export interface TUserStatisticUpdatePayload {
  id: number;
  type: EStatisticProperty;
}
