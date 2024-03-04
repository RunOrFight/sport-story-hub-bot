import { Body, Delete, Get, Post, Put, Route, Tags } from "tsoa";
import { TeamParticipantService } from "../services/team-participant.service";
import {
  TTeamParticipantAddPayload,
  TTeamParticipantDeletePayload,
} from "../types/team-participant.types";

@Route("/api/team-participant")
@Tags("TeamParticipants")
export class TeamParticipantController {
  private teamParticipantService = new TeamParticipantService();

  @Post("/create")
  async addTeamParticipant(@Body() payload: TTeamParticipantAddPayload) {
    return this.teamParticipantService.addTeamParticipant(payload);
  }

  @Delete("/delete")
  async deleteTeamParticipant(@Body() payload: TTeamParticipantDeletePayload) {
    return this.teamParticipantService.deleteTeamParticipant(payload);
  }
}
