import db from "../database";
import { Event } from "../database/entities/Event";
import {
  TGameCreatePayload,
  TGameDeletePayload,
  TGameUpdatePayload,
} from "../types/game.types";
import { Game } from "../database/entities/Game";
import { GameTeam } from "../database/entities/GameTeam";
import { GameDTO } from "../DTOs/game.DTO";

export class GameService {
  async getGameById(id: number): Promise<GameDTO> {
    const game = await db.getRepository(Game).findOne({
      relations: {
        gameTeams: {
          team: {
            teamsParticipants: { participant: { user: { photo: true } } },
          },
        },
        gameStats: {
          teamParticipant: { participant: { user: { photo: true } } },
        },
        event: true,
      },
      where: { id },
    });

    if (!game) {
      throw new Error(`Game with id ${id} not found`);
    }

    return new GameDTO(game);
  }
  async createGame(payload: TGameCreatePayload): Promise<GameDTO> {
    const { name, eventId, teamIds } = payload;

    if (teamIds.length !== 2) {
      throw new Error(`Game need 2 teams`);
    }

    const game = new Game();
    game.name = name;

    if (!eventId) {
      throw new Error(`Event id not passed`);
    }

    const event = await db
      .getRepository(Event)
      .findOne({ relations: { teams: true }, where: { id: eventId } });

    if (!event) {
      throw new Error(`Event with id ${eventId} not found`);
    }

    game.event = event;
    const createdGame = await db.getRepository(Game).save(game);

    if (!createdGame) {
      throw new Error(`Game was not created`);
    }

    game.gameTeams = await this.updateGameTeams(teamIds, createdGame, event);

    return new GameDTO(game);
  }

  async updateGame(payload: TGameUpdatePayload): Promise<GameDTO> {
    const { name, id, teamIds } = payload;

    const game = await db
      .getRepository(Game)
      .findOne({ relations: { event: { teams: true } }, where: { id } });

    if (!game) {
      throw new Error(`Game with id: ${id} not found`);
    }

    game.name = name ? name : game.name;

    if (teamIds) {
      if (teamIds.length !== 2) {
        throw new Error(`Game need 2 teams`);
      }

      game.gameTeams = await this.updateGameTeams(teamIds, game, game.event);
    }

    await db.getRepository(Game).save(game);
    return new GameDTO(game);
  }

  async deleteGame(payload: TGameDeletePayload): Promise<boolean> {
    const { id } = payload;

    const game = await db.getRepository(Game).findOneBy({ id });

    if (!game) {
      throw new Error(`Game with id: ${id} not found`);
    }

    await db.getRepository(Game).delete({ id: game.id });
    return true;
  }

  /**
   *
   * @param teamIds
   * @param game
   * @param event
   * @private
   * @description Event must include team relation
   */
  private async updateGameTeams(
    teamIds: number[],
    game: Game,
    event: Event,
  ): Promise<GameTeam[]> {
    await db.getRepository(GameTeam).delete({
      game: { id: game.id },
    });

    const gameTeams: GameTeam[] = [];
    for (const tId of teamIds) {
      const teamInEvent = event.teams.find((eventTeam) => eventTeam.id === tId);
      if (!teamInEvent) {
        throw new Error(`Team with id ${tId} not found in event ${event.id}`);
      }

      const gameTeam = new GameTeam();
      gameTeam.game = game;
      gameTeam.team = teamInEvent;

      const newGameTeam = await db.getRepository(GameTeam).save(gameTeam);
      if (!newGameTeam) {
        throw new Error(`Game team was not created`);
      }

      gameTeams.push(newGameTeam);
    }

    if (gameTeams.length !== 2) {
      throw new Error(`Something went wrong, teams were not added to the game`);
    }

    return gameTeams;
  }
}
