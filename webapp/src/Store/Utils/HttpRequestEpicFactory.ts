import { concat, EMPTY, from, merge, of, switchMap } from "rxjs";
import { requestManagerSlice } from "../RequestManager/RequestManagerSlice.ts";
import { IWithError } from "../../Models/IError.ts";
import { PayloadActionCreator } from "@reduxjs/toolkit";

interface IHttpRequestEpicFactoryProps<T> {
  input: Promise<T | IWithError>;
  requestSymbol: symbol;
  receivedActionCreator?: PayloadActionCreator<T>;
}

const httpRequestEpicFactory = <T extends object>({
  input,
  requestSymbol,
  receivedActionCreator,
}: IHttpRequestEpicFactoryProps<T>) =>
  concat(
    of(requestManagerSlice.actions.loading({ symbol: requestSymbol })),
    from(input).pipe(
      switchMap((result) => {
        if ("error" in result) {
          return of(
            requestManagerSlice.actions.error({
              symbol: requestSymbol,
              error: result.error,
            }),
          );
        }

        return merge(
          of(requestManagerSlice.actions.success({ symbol: requestSymbol })),
          receivedActionCreator ? of(receivedActionCreator(result)) : EMPTY,
        );
      }),
    ),
  );

export { httpRequestEpicFactory };
