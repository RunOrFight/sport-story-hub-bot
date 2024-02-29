import { NextFunction, Request, Response } from "express";
import db from "../database";
import { User } from "../database/entities/User";
import { EUserRole } from "../enums/user-role.enum";

export const adminRoleMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.log(req.headers, "HEADERS");
  const userId = Number(req.headers["user-id"]);
  if (isNaN(userId)) {
    return next(new Error(`No user-id in headers`));
  }
  const user = await db.getRepository(User).findOne({ where: { id: userId } });
  if (!user) {
    return next(new Error(`User with id: ${userId} not found`));
  }

  if (!user.roles.includes(EUserRole.ADMIN)) {
    return next(new Error(`Permission denied`));
  }

  next();
};
