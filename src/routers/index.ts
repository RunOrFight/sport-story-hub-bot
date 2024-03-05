import { Router } from "express";
import { UserRouter } from "./user.router";
import { EventRouter } from "./event.router";
import { LocationRouter } from "./location.router";
import { TeamRouter } from "./team.router";
import { TeamParticipantRouter } from "./team-participant.router";
import { GameRouter } from "./game.router";

export const MainRouter = Router();

MainRouter.use("/user", UserRouter);
MainRouter.use("/event", EventRouter);
MainRouter.use("/location", LocationRouter);
MainRouter.use("/team", TeamRouter);
MainRouter.use("/team-participant", TeamParticipantRouter);
MainRouter.use("/game", GameRouter);
