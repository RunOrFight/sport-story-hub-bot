import db from "../database";
import { Event } from "../database/entities/Event";
import { Team } from "../database/entities/Team";
import {
  TTeamCreatePayload,
  TTeamDeletePayload,
  TTeamUpdatePayload,
} from "../types/team.types";
import { Participant } from "../database/entities/Participant";
import { TeamParticipant } from "../database/entities/TeamParticipant";

export class TeamService {
  async getTeamsByEventId(): Promise<Team[]> {
    throw new Error("Method not implemented");
  }

  async createTeam(payload: TTeamCreatePayload): Promise<Team> {
    const { name, eventId } = payload;

    const team = new Team();
    team.name = name;

    if (!eventId) {
      throw new Error(`Event id not passed`);
    }

    const event = await db.getRepository(Event).findOneBy({ id: eventId });

    if (!event) {
      throw new Error(`Event with id ${eventId} not found`);
    }

    team.event = event;

    const createdTeam = await db.getRepository(Team).save(team);

    if (!createdTeam) {
      throw new Error(`Event not created`);
    }

    return createdTeam;
  }

  async updateTeam(payload: TTeamUpdatePayload): Promise<Team> {
    const { name, id } = payload;

    const team = await db.getRepository(Team).findOneBy({ id });

    if (!team) {
      throw new Error(`Team with id: ${id} not found`);
    }

    team.name = name ? name : team.name;

    await db.getRepository(Team).save(team);
    return team;
  }

  async deleteTeam(payload: TTeamDeletePayload): Promise<boolean> {
    const { id } = payload;

    const team = await db.getRepository(Team).findOneBy({ id });

    if (!team) {
      throw new Error(`Team with id: ${id} not found`);
    }

    await db.getRepository(Team).delete({ id: team.id });
    return true;
  }
}
