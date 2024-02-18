import { Router } from "express";
import { UserRouter } from "./user.router";
import { ParticipantRouter } from "./participant.router";

export const MainRouter = Router();

MainRouter.use("/user", UserRouter);
MainRouter.use("/participant", ParticipantRouter);
