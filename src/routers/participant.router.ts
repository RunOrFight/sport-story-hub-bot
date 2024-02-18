import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { ParticipantController } from "../controllers/participant.controller";

export const ParticipantRouter = Router();

const participantController = new ParticipantController();

ParticipantRouter.get("/all", async (req, res) => {
  return participantController.getAllParticipants();
});
