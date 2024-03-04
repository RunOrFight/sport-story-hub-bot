import { EventController } from "../controllers/event.controller";
import { Request, Router } from "express";
import {
  TEventCreatePayload,
  TEventDeletePayload,
  TEventUpdatePayload,
} from "../types/event.types";

export const EventRouter = Router();

const eventController = new EventController();

type TEventController = typeof eventController;
EventRouter.get("/all", async (req, res) => {
  const data = await eventController.getAllEvents();
  res.status(200).json({ events: data });
});

EventRouter.get("/getById/:id", async (req: Request<{ id: number }>, res) => {
  if (!req.params?.id) {
    throw new Error("Param id is not found");
  }
  const data = await eventController.getEventById(req.params.id);
  res.status(200).json({ event: data });
});

EventRouter.post(
  "/join-event",
  async (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      { eventId: number; username: string }
    >,
    res,
  ) => {
    if (!req.body.eventId || !req.body.username) {
      throw new Error("Not all fields were passed in request body");
    }
    const data = await eventController.joinEvent(req.body);
    res.status(200).json({ userJoinedEvent: data });
  },
);

EventRouter.delete(
  "/leave-event",
  async (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      { eventId: number; username: string }
    >,
    res,
  ) => {
    if (!req.body.eventId || !req.body.username) {
      throw new Error("Not all fields were passed in request body");
    }
    const data = await eventController.leaveEvent(req.body);
    res.status(200).json({ userLeftEvent: data });
  },
);

EventRouter.post(
  "/create",
  async (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      TEventCreatePayload
    >,
    res,
  ) => {
    const data = await eventController.createEvent(req.body);
    res.status(200).json({ createdEvent: data });
  },
);

EventRouter.put(
  "/update",
  async (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      TEventUpdatePayload
    >,
    res,
  ) => {
    const data = await eventController.updateEvent(req.body);
    res.status(200).json({ updatedEvent: data });
  },
);

EventRouter.delete(
  "/delete",
  async (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      TEventDeletePayload
    >,
    res,
  ) => {
    const data = await eventController.deleteEvent(req.body);
    res.status(200).json({ eventDeleted: data });
  },
);

export type { TEventController };
