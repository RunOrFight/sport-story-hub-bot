import db from "../database";
import { Team } from "../database/entities/Team";
import { Participant } from "../database/entities/Participant";
import { TeamParticipant } from "../database/entities/TeamParticipant";
import {
  TTeamParticipantAddPayload,
  TTeamParticipantDeletePayload,
} from "../types/team-participant.types";

export class TeamParticipantService {
  async addTeamParticipant(
    payload: TTeamParticipantAddPayload,
  ): Promise<TeamParticipant> {
    const { teamId, participantId } = payload;

    const team = await db
      .getRepository(Team)
      .findOne({ relations: { event: true }, where: { id: teamId } });
    if (!team) {
      throw new Error(`Team with id: ${teamId} not found`);
    }

    const participant = await db
      .getRepository(Participant)
      .findOne({ relations: { event: true }, where: { id: participantId } });
    if (!participant) {
      throw new Error(`Participant with id: ${participantId} not found`);
    }

    if (team.event.id !== participant.event.id) {
      throw new Error(`Different event IDs for participant and team`);
    }

    const teamParticipant = new TeamParticipant();
    teamParticipant.team = team;
    teamParticipant.participant = participant;

    const createdTeamParticipant = await db
      .getRepository(TeamParticipant)
      .save(teamParticipant);

    if (!createdTeamParticipant) {
      throw new Error(`Team participant not added`);
    }

    return createdTeamParticipant;
  }

  async deleteTeamParticipant(
    payload: TTeamParticipantDeletePayload,
  ): Promise<boolean> {
    const { teamId, participantId } = payload;

    const team = await db
      .getRepository(Team)
      .findOne({ relations: { event: true }, where: { id: teamId } });
    if (!team) {
      throw new Error(`Team with id: ${teamId} not found`);
    }

    const participant = await db
      .getRepository(Participant)
      .findOne({ relations: { event: true }, where: { id: participantId } });
    if (!participant) {
      throw new Error(`Participant with id: ${participantId} not found`);
    }

    if (team.event.id !== participant.event.id) {
      throw new Error(`Different event IDs for participant and team`);
    }

    const teamParticipant = await db.getRepository(TeamParticipant).findOne({
      relations: { team: true, participant: true },
      where: {
        team: { id: team.id },
        participant: { id: participant.id },
      },
    });

    if (!teamParticipant) {
      throw new Error(
        `Team participant with id: ${participantId} in team id ${teamId} not found`,
      );
    }

    await db.getRepository(TeamParticipant).delete({ id: teamParticipant.id });

    return true;
  }
}
