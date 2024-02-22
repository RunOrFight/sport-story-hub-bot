import { TEventController } from "../../../src/routers/event.router.ts";

type TEvent = Omit<
  Awaited<ReturnType<TEventController["getAllEvents"]>>[number],
  "calculateWinRateAndTotal" | "dateTime"
> & {
  dateTime: null | string;
};

export type { TEvent };
