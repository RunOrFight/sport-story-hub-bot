import { Body, Delete, Get, Post, Put, Route, Tags } from "tsoa";
import { TeamService } from "../services/team.service";
import {
  TTeamCreatePayload,
  TTeamDeletePayload,
  TTeamUpdatePayload,
} from "../types/team.types";

@Route("/api/team")
@Tags("Teams")
export class TeamController {
  private teamService = new TeamService();

  @Post("/create")
  async createTeam(@Body() payload: TTeamCreatePayload) {
    return this.teamService.createTeam(payload);
  }

  @Put("/update")
  async updateTeam(@Body() payload: TTeamUpdatePayload) {
    return this.teamService.updateTeam(payload);
  }

  @Delete("/delete")
  async deleteTeam(@Body() payload: TTeamDeletePayload) {
    return this.teamService.deleteTeam(payload);
  }
}
