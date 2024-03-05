import { Request, Router } from "express";
import { GameController } from "../controllers/game.controller";
import {
  TGameCreatePayload,
  TGameDeletePayload,
  TGameUpdatePayload,
} from "../types/game.types";

export const GameRouter = Router();

const gameController = new GameController();

GameRouter.post(
  "/create",
  async (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      TGameCreatePayload
    >,
    res,
  ) => {
    const data = await gameController.createGame(req.body);
    res.status(200).json({ createdGame: data });
  },
);

GameRouter.put(
  "/update",
  async (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      TGameUpdatePayload
    >,
    res,
  ) => {
    const data = await gameController.updateGame(req.body);
    res.status(200).json({ updatedGame: data });
  },
);

GameRouter.delete(
  "/delete",
  async (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      TGameDeletePayload
    >,
    res,
  ) => {
    const data = await gameController.deleteGame(req.body);
    res.status(200).json({ gameWasDeleted: data });
  },
);
