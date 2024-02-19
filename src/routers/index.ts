import { Router } from "express";
import { UserRouter } from "./user.router";
import { ParticipantRouter } from "./participant.router";
import { EventRouter } from "./event.router";

export const MainRouter = Router();

MainRouter.use("/user", UserRouter);
MainRouter.use("/event", EventRouter);
MainRouter.use("/participant", ParticipantRouter);
