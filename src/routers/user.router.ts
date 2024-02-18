import { Request, Router } from "express";
import { UserController } from "../controllers/user.controller";
import { TUserStatisticUpdatePayload } from "../types/user.types";

export const UserRouter = Router();

const userController = new UserController();

UserRouter.get("/all", async (req, res) => {
  const data = await userController.getAllUsers();
  res.status(200).json({ users: data });
});

UserRouter.put(
  "/update",
  async (req: Request<{}, {}, TUserStatisticUpdatePayload>, res) => {
    const updatedUser = await userController.updateUser(req.body);
    res.status(200).json(updatedUser);
  },
);
