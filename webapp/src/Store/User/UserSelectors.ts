import { AppState } from "../CreateStore.ts";
import { getNotNil } from "../../Utils/GetNotNil.ts";

const userSelector = (state: AppState) => state.user;

const userStatusSelector = (state: AppState) => userSelector(state).status;

const userInfoNotNilSelector = (state: AppState) =>
  getNotNil(userSelector(state).info, "userInfoNotNilSelector");

const userErrorNotNilSelector = (state: AppState) =>
  getNotNil(userSelector(state).error, "userErrorNotNilSelector");

export { userStatusSelector, userInfoNotNilSelector, userErrorNotNilSelector };
