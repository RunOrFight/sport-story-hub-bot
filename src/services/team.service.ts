import db from "../database";
import { Event } from "../database/entities/Event";
import { Team } from "../database/entities/Team";
import {
  TTeamCreatePayload,
  TTeamDeletePayload,
  TTeamUpdatePayload,
} from "../types/team.types";
import { Game } from "../database/entities/Game";
import { GameTeam } from "../database/entities/GameTeam";
import _ from "lodash";
import { TeamParticipant } from "../database/entities/TeamParticipant";
import { In } from "typeorm";

export class TeamService {
  async getTeamsByEventId(): Promise<Team[]> {
    throw new Error("Method not implemented");
  }

  async createTeam(payload: TTeamCreatePayload): Promise<Team> {
    const { name, eventId, participantIds } = payload;

    const team = new Team();
    team.name = name;

    if (!eventId) {
      throw new Error(`Event id not passed`);
    }

    const event = await db
      .getRepository(Event)
      .findOne({ relations: { participants: true }, where: { id: eventId } });

    if (!event) {
      throw new Error(`Event with id ${eventId} not found`);
    }
    team.event = event;

    const createdTeam = await db.getRepository(Team).save(team);

    if (!createdTeam) {
      throw new Error(`Event not created`);
    }

    team.teamsParticipants = [];
    team.teamsParticipants = participantIds
      ? await this.updateTeamParticipants(participantIds, team, event)
      : [];

    return createdTeam;
  }

  async updateTeam(payload: TTeamUpdatePayload): Promise<Team> {
    const { name, id, participantIds } = payload;

    const team = await db.getRepository(Team).findOne({
      relations: {
        event: { participants: true },
        teamsParticipants: { participant: true },
      },
      where: { id },
    });

    if (!team) {
      throw new Error(`Team with id: ${id} not found`);
    }

    team.name = name ? name : team.name;

    await db.getRepository(Team).save(team);
    team.teamsParticipants = participantIds
      ? await this.updateTeamParticipants(participantIds, team, team.event)
      : [];
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

  private async updateTeamParticipants(
    participantIds: number[],
    team: Team,
    event: Event,
  ): Promise<TeamParticipant[]> {
    const eventParticipantIds = event.participants.map((p) => p.id);

    const participantsNotBelongToEvent = participantIds.filter(
      (pId) => !eventParticipantIds.includes(pId),
    );

    if (participantsNotBelongToEvent.length) {
      throw new Error(
        `Participant(s) with id ${participantsNotBelongToEvent.join(", ")} not belong to event`,
      );
    }

    const existingTpIds = team.teamsParticipants.map((tp) => tp.participant.id);

    const tpIdsToDelete = _.difference(existingTpIds, participantIds);
    const tpIdsToAdd = _.difference(participantIds, existingTpIds);

    if (tpIdsToDelete.length) {
      await db.getRepository(TeamParticipant).delete({
        participant: { id: In(tpIdsToDelete) },
        team: { id: team.id },
      });
    }

    if (tpIdsToAdd.length) {
      const objectsForInsert = tpIdsToAdd.map((tpId) => {
        const tp = new TeamParticipant();
        tp.team = team;
        tp.participant = event.participants.find((p) => p.id === tpId)!;
        return tp;
      });

      const addedTps = db
        .getRepository(TeamParticipant)
        .create(objectsForInsert);
      await db.getRepository(TeamParticipant).insert(addedTps);
    }

    return db.getRepository(TeamParticipant).find({
      relations: { participant: { user: { photo: true } } },
      where: { team: { id: team.id } },
    });
  }
}
