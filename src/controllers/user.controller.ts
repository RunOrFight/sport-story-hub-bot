import { userService } from "../services/user.service";
import { Request, Response } from "express";
import { User } from "../database/entities/User";
import { IUserStatisticUpdate } from "../interfaces/user.interface";
import { TUserStatisticUpdatePayload } from "../types/user.types";
import { Body, Get, Post, Put, Route, Tags } from "tsoa";

@Route("/api/user")
@Tags("User")
export class UserController {
  @Get("/all")
  async getAllUsers(): Promise<User[]> {
    return await userService.getAllUsers();
  }

  @Put("/update")
  async updateUser(
    @Body() payload: TUserStatisticUpdatePayload,
  ): Promise<boolean> {
    const { id, type } = payload;
    const qwe = await userService.updateUserStatistic(id, type);
    return qwe;
  }
}
