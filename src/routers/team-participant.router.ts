import { Request, Router } from "express";
import { TeamParticipantController } from "../controllers/team-participant.controller";
import {
  TTeamParticipantAddPayload,
  TTeamParticipantDeletePayload,
} from "../types/team-participant.types";

export const TeamParticipantRouter = Router();

const teamParticipantController = new TeamParticipantController();

TeamParticipantRouter.post(
  "/create",
  async (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      TTeamParticipantAddPayload
    >,
    res,
  ) => {
    const data = await teamParticipantController.addTeamParticipant(req.body);
    res.status(200).json({ addedTeamParticipant: data });
  },
);

TeamParticipantRouter.delete(
  "/delete",
  async (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      TTeamParticipantDeletePayload
    >,
    res,
  ) => {
    const data = await teamParticipantController.deleteTeamParticipant(
      req.body,
    );
    res.status(200).json({ teamParticipantWasDeleted: data });
  },
);
