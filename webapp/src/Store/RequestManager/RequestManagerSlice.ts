import { ERequestStatus } from "./ERequestStatus.ts";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IWithError } from "../../Models/IError.ts";

interface IRequestManagerSlice {
  [key: symbol]: {
    status: ERequestStatus;
    error?: string;
  };
}

const initialState: IRequestManagerSlice = {};

interface IWithSymbol {
  symbol: symbol;
}

const requestManagerSlice = createSlice({
  name: "requestManager",
  initialState,
  reducers: {
    loading: (state, { payload: { symbol } }: PayloadAction<IWithSymbol>) => {
      state[symbol] = {
        status: ERequestStatus.loading,
      };
    },
    success: (state, { payload: { symbol } }: PayloadAction<IWithSymbol>) => {
      state[symbol] = {
        status: ERequestStatus.success,
      };
    },
    error: (
      state,
      { payload: { symbol, error } }: PayloadAction<IWithSymbol & IWithError>,
    ) => {
      state[symbol] = {
        status: ERequestStatus.error,
        error,
      };
    },
    clear: (state, { payload: { symbol } }: PayloadAction<IWithSymbol>) => {
      delete state[symbol];
    },
  },
  selectors: {
    statusBySymbol: (sliceState, symbol: symbol) =>
      sliceState[symbol].status ?? ERequestStatus.idle,
  },
});

export { requestManagerSlice };
