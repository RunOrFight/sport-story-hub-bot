import { userService } from "../services/user.service";
import { User } from "../database/entities/User";
import { IUserUpdatePayload } from "../types/user.types";
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

  @Post("/init")
  async userInit(@Body() payload: { username: string }) {
    return userService.userInit(payload);
  }

  @Put("/update")
  async updateUser(@Body() payload: IUserUpdatePayload) {
    return userService.updateUser(payload);
  }
}
