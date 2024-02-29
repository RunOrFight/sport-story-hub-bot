import { createPropertySelectors } from "../CreatePropertySelectors.ts";
import { AppState } from "../CreateStore.ts";

const locationsSelectors = createPropertySelectors(
  (state: AppState) => state.locations,
);

export { locationsSelectors };
