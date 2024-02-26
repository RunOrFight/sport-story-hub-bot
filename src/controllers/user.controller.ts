import { userService } from "../services/user.service";
import { Request, Response } from "express";
import { User } from "../database/entities/User";
import { IUserStatisticUpdate } from "../interfaces/user.interface";
import { TUserStatisticUpdatePayload } from "../types/user.types";
import { Body, Get, Path, Post, Put, Route, Tags } from "tsoa";

@Route("/api/user")
@Tags("User")
export class UserController {
  @Get("/all")
  async getAllUsers() {
    return userService.getAllUsers();
  }

  @Get("getById/{id}")
  async getUserById(@Path() id: number) {
    return userService.getUserById(id);
  }

  @Get("getByUserName/{username}")
  async getUserByUsername(@Path() username: string) {
    return userService.getUserByUsername(username);
  }

  @Put("/update")
  async updateUser(@Body() payload: TUserStatisticUpdatePayload): Promise<any> {
    const { id, type } = payload;
    const qwe = await userService.updateUserStatistic(id, type);
    return qwe;
  }
}
