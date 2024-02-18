import { EStatisticProperty } from "../enums/statistic-propery-enum";

export interface IUserStatisticUpdate {
  id: number;
  type: EStatisticProperty;
}
