import { TEventController } from "../../../src/routers/event.router.ts";

type TEvent = Omit<
  Awaited<ReturnType<TEventController["getAllEvents"]>>[number],
  "calculateWinRateAndTotal"
>;

export type { TEvent };
