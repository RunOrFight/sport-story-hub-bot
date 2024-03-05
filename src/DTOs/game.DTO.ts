import { GameTeam } from "../database/entities/GameTeam";
import { Event } from "../database/entities/Event";
import { Team } from "../database/entities/Team";
import { Game } from "../database/entities/Game";

export class GameDTO {
  id: number;
  name: string;
  event: Event;
  gameTeams: GameTeamDTO[];

  constructor(game: Game) {
    this.id = game.id;
    this.name = game.name;
    this.event = game.event;
    this.gameTeams = game.gameTeams.map((gt) => new GameTeamDTO(gt));
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
