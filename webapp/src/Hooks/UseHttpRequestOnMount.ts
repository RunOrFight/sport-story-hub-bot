import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { httpApi, type THttpApi } from "../httpApi.ts";

type THttpRequestKey = Exclude<
  keyof THttpApi,
  "getEventById" | "getUserFromRowsByUsername"
>;

interface IHookResponse<T> {
  data: T;
  setData: Dispatch<SetStateAction<T>>;
}

function useHttpRequestOnMount<K extends THttpRequestKey>(
  httpKey: K,
): IHookResponse<Awaited<ReturnType<THttpApi[K]>>>;

function useHttpRequestOnMount<
  K extends THttpRequestKey,
  N extends (data: Awaited<ReturnType<THttpApi[K]>>) => any,
>(
  httpKey: K,
  normalizer: N,
): N extends (data: any) => infer T ? IHookResponse<T> : never;

function useHttpRequestOnMount(
  httpKey: THttpRequestKey,
  normalizer?: (data: Awaited<ReturnType<THttpApi[THttpRequestKey]>>) => any,
) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    httpApi[httpKey]().then((data) =>
      setData(normalizer ? normalizer(data) : data),
    );
  }, []);

  return { data, setData };
}

export { useHttpRequestOnMount };
