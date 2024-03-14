import db from "../database";
import { TeamParticipant } from "../database/entities/TeamParticipant";
import {
  TGameStatAddPayload,
  TGameStatDeletePayload,
} from "../types/game-stat.types";
import { Game } from "../database/entities/Game";
import { GameStat } from "../database/entities/GameStat";

export class GameStatService {
  async addGameStat(payload: TGameStatAddPayload): Promise<GameStat> {
    const { type, gameId, teamParticipantId, createdAt } = payload;

    const game = await db.getRepository(Game).findOne({
      relations: {
        event: true,
        gameTeams: {
          team: { teamsParticipants: { participant: { user: true } } },
        },
      },
      where: { id: gameId },
    });
    if (!game) {
      throw new Error(`Game with id: ${gameId} not found`);
    }

    const teamParticipantInGame = this.findTeamParticipantInGame(
      game,
      teamParticipantId,
    );

    if (!teamParticipantInGame) {
      throw new Error(`Team participant does not exist in game`);
    }

    const gameStat = new GameStat();
    gameStat.type = type;
    gameStat.game = game;
    gameStat.teamParticipant = teamParticipantInGame;

    if (createdAt) {
      gameStat.createdAt = createdAt;
    }

    const createdGameStat = await db.getRepository(GameStat).save(gameStat);

    if (!createdGameStat) {
      throw new Error(`Game stat not added`);
    }

    return createdGameStat;
  }

  async deleteGameStat(payload: TGameStatDeletePayload): Promise<boolean> {
    const { id } = payload;

    const gameStat = await db.getRepository(GameStat).findOne({
      where: { id },
    });

    if (!gameStat) {
      throw new Error(`Game stat not found`);
    }

    await db.getRepository(GameStat).delete({ id: gameStat.id });

    return true;
  }

  /**
   *
   * @param game - should have team participant relation
   * @param teamParticipantId
   * @private
   */
  private findTeamParticipantInGame(
    game: Game,
    teamParticipantId: number,
  ): TeamParticipant | undefined {
    let teamParticipant: TeamParticipant | undefined;

    if (game.gameTeams) {
      for (const gt of game.gameTeams) {
        if (gt.team?.teamsParticipants) {
          teamParticipant = gt.team.teamsParticipants.find(
            (tp) => tp.id === teamParticipantId,
          );
        }
      }
    }

    return teamParticipant;
  }
}
