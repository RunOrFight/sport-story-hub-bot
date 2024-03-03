import { Request, Router } from "express";
import { UserController } from "../controllers/user.controller";
import { TUserUpdatePayload } from "../types/user.types";

export const UserRouter = Router();

const userController = new UserController();

type TUserController = typeof userController;

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

UserRouter.post(
  "/init",
  async (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      { username: string }
    >,
    res,
  ) => {
    if (!req.body?.username) {
      throw new Error("username is not found");
    }
    const data = await userController.userInit(req.body);
    res.status(200).json({ data });
  },
);

UserRouter.put(
  "/update",
  async (
    req: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      TUserUpdatePayload
    >,
    res,
  ) => {
    if (!req.body?.username) {
      throw new Error("Username not found");
    }
    const updatedUser = await userController.updateUser(req.body);
    res.status(200).json({ updatedUser });
  },
);

export type { TUserController };
