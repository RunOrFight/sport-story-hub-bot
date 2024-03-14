import { Request, Router } from "express";
import { GameController } from "../controllers/game.controller";
import {
  TGameCreatePayload,
  TGameDeletePayload,
  TGameUpdatePayload,
} from "../types/game.types";
import {
  TGameStatAddPayload,
  TGameStatDeletePayload,
} from "../types/game-stat.types";

export const GameRouter = Router();

const gameController = new GameController();

GameRouter.get("/getById/:id", async (req: Request<{ id: number }>, res) => {
  if (!req.params?.id) {
    throw new Error("Param id is not found");
  }
  const data = await gameController.getGameById(req.params.id);
  return res.status(200).json({ game: data });
});

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

GameRouter.post(
  "/stat/add",
  async (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      TGameStatAddPayload
    >,
    res,
  ) => {
    const data = await gameController.addGameStat(req.body);
    res.status(200).json({ addedGameStat: data });
  },
);

GameRouter.delete(
  "/stat/delete",
  async (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      TGameStatDeletePayload
    >,
    res,
  ) => {
    const data = await gameController.deleteGameStat(req.body);
    res.status(200).json({ gameStatDeleted: data });
  },
);
