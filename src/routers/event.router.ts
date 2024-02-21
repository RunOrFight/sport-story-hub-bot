import { EventController } from "../controllers/event.controller";
import { eventService } from "../services/event.service";
import { Request, Router } from "express";

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
  const data = await eventService.getEventById(req.params.id);
  res.status(200).json({ event: data });
});

export type { TEventController };
