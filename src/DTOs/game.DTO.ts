import { GameTeam } from "../database/entities/GameTeam";
import { Event } from "../database/entities/Event";
import { Team } from "../database/entities/Team";
import { Game } from "../database/entities/Game";
import { TeamParticipant } from "../database/entities/TeamParticipant";
import { GameStat } from "../database/entities/GameStat";
import { EGameEventType } from "../enums/game-event.enum";

export class GameDTO {
  id: number;
  name: string;
  event: Event;
  gameTeams: GameTeamDTO[];
  gameStats: GameStatDTO[];

  constructor(game: Game) {
    this.id = game.id;
    this.name = game.name;
    this.event = game.event;
    this.gameTeams = game.gameTeams.map((gt) => new GameTeamDTO(gt));
    this.gameStats = game.gameStats.map((gs) => new GameStatDTO(gs));
  }
}

class GameTeamDTO {
  id: number;
  team: Team;

  constructor(gameTeam: GameTeam) {
    this.id = gameTeam.id;
    this.team = gameTeam.team;
  }
}

class GameStatDTO {
  id: number;
  teamParticipant: TeamParticipant;
  type: EGameEventType;

  constructor(gameStat: GameStat) {
    this.id = gameStat.id;
    this.teamParticipant = gameStat.teamParticipant;
    this.type = gameStat.type;
  }
}
