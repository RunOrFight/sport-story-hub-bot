import { Request, Router } from "express";
import { LocationController } from "../controllers/location.controller";
import {
  TLocationCreatePayload,
  TLocationDeletePayload,
  TLocationUpdatePayload,
} from "../types/location.types";

export const LocationRouter = Router();

const locationController = new LocationController();

LocationRouter.get("/all", async (req, res) => {
  const data = await locationController.getAllLocations();
  res.status(200).json({ locations: data });
});

LocationRouter.post(
  "/create",
  async (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      TLocationCreatePayload
    >,
    res,
  ) => {
    const data = await locationController.createLocation(req.body);
    res.status(200).json({ newLocation: data });
  },
);

LocationRouter.put(
  "/update",
  async (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      TLocationUpdatePayload
    >,
    res,
  ) => {
    const data = await locationController.updateLocation(req.body);
    res.status(200).json({ updatedLocation: data });
  },
);

LocationRouter.delete(
  "/delete",
  async (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      TLocationDeletePayload
    >,
    res,
  ) => {
    const data = await locationController.deleteLocation(req.body);
    res.status(200).json({ locationWasDeleted: data });
  },
);
