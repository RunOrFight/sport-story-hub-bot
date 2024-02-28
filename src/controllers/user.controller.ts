import { UserService } from "../services/user.service";
import { IUserUpdatePayload } from "../types/user.types";
import { Body, Get, Path, Post, Put, Route, Tags } from "tsoa";

@Route("/api/user")
@Tags("User")
export class UserController {
  private userService = new UserService();

  @Get("/all")
  async getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get("getById/{id}")
  async getUserById(@Path() id: number) {
    return this.userService.getUserById(id);
  }

  @Post("/init")
  async userInit(@Body() payload: { username: string }) {
    return this.userService.userInit(payload);
  }

  @Put("/update")
  async updateUser(@Body() payload: IUserUpdatePayload) {
    return this.userService.updateUser(payload);
  }
}
