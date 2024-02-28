import { Router } from "express";
import { LocationController } from "../controllers/location.controller";

export const LocationRouter = Router();

const locationController = new LocationController();

LocationRouter.get("/all", async (req, res) => {
  const data = await locationController.getAllLocations();
  res.status(200).json({ locations: data });
});
