import { userService } from "../services/user.service";
import { Request, Response } from "express";
import { User } from "../database/entities/User";
import { Get, Route, Tags } from "tsoa";

@Route("/api/participant")
@Tags("Participant")
export class ParticipantController {
  @Get("/all")
  async getAllParticipants(): Promise<User[]> {
    return await userService.getAllUsers();
  }
}
