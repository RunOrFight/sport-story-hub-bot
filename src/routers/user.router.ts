import { Request, Router } from "express";
import { UserController } from "../controllers/user.controller";
import { TUserStatisticUpdatePayload } from "../types/user.types";

export const UserRouter = Router();

const userController = new UserController();

UserRouter.get("/all", async (req, res) => {
  const data = await userController.getAllUsers();
  res.status(200).json({ users: data });
});

UserRouter.get("/getById/:id", async (req: Request<{ id: number }>, res) => {
  if (!req.params?.id) {
    throw new Error("Param id is not found");
  }
  const data = await userController.getUserById(req.params.id);
  res.status(200).json({ user: data });
});

UserRouter.get("/getByUsername/:username", async (req: Request<{ username: string }>, res) => {
  if (!req.params?.username) {
    throw new Error("Param username is not found");
  }
  const data = await userController.getUserByUsername(req.params.username);
  res.status(200).json({ user: data });
});

UserRouter.put(
  "/update",
  async (req: Request<{}, {}, TUserStatisticUpdatePayload>, res) => {
    const updatedUser = await userController.updateUser(req.body);
    res.status(200).json(updatedUser);
  },
);
