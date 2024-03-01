import { AppState } from "../CreateStore.ts";
import { getNotNil } from "../../Utils/GetNotNil.ts";
import { createPropertySelectors } from "../CreatePropertySelectors.ts";

const userSelectors = createPropertySelectors((state: AppState) => state.user);

const userStatusSelector = userSelectors.status;

const userInfoNotNilSelector = (state: AppState) =>
  getNotNil(userSelectors.info(state), "userInfoNotNilSelector");

const userErrorNotNilSelector = (state: AppState) =>
  getNotNil(userSelectors.error(state), "userErrorNotNilSelector");

const userInfoUsernameNotNilSelector = (state: AppState) =>
  getNotNil(
    userSelectors.info(state)?.username,
    "userInfoUsernameNotNilSelector",
  );

export {
  userStatusSelector,
  userInfoNotNilSelector,
  userErrorNotNilSelector,
  userSelectors,
  userInfoUsernameNotNilSelector,
};
