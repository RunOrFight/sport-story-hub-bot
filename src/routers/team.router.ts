import { Request, Router } from "express";
import { TeamController } from "../controllers/team.controller";
import {
  TTeamCreatePayload,
  TTeamDeletePayload,
  TTeamUpdatePayload,
} from "../types/team.types";

export const TeamRouter = Router();

const teamController = new TeamController();

TeamRouter.post(
  "/create",
  async (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      TTeamCreatePayload
    >,
    res,
  ) => {
    const data = await teamController.createTeam(req.body);
    res.status(200).json({ createdTeam: data });
  },
);

TeamRouter.put(
  "/update",
  async (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      TTeamUpdatePayload
    >,
    res,
  ) => {
    const data = await teamController.updateTeam(req.body);
    res.status(200).json({ updatedTeam: data });
  },
);

TeamRouter.delete(
  "/delete",
  async (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      TTeamDeletePayload
    >,
    res,
  ) => {
    const data = await teamController.deleteTeam(req.body);
    res.status(200).json({ teamWasDeleted: data });
  },
);
