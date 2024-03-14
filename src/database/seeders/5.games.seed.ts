import { Seeder } from "@jorgebodega/typeorm-seeding";
import { DataSource } from "typeorm";
import { Event } from "../entities/Event";
import { Seeder as SeederModel } from "../entities/Seeder";
import { Team } from "../entities/Team";
import { Game } from "../entities/Game";
import { GameTeam } from "../entities/GameTeam";
import { GameStat } from "../entities/GameStat";
import { EGameEventType } from "../../enums/game-event.enum";

export default class UserSeeder extends Seeder {
  private name = "add_games";

  async run(dataSource: DataSource) {
    const seedWasUsed = await dataSource
      .createEntityManager()
      .getRepository("seeders")
      .findOne({ where: { name: this.name } });
    if (!seedWasUsed) {
      const events = (await dataSource
        .createEntityManager()
        .getRepository("events")
        .find()) as Event[];

      for (const [index, event] of events.entries()) {
        const teams = (await dataSource
          .createEntityManager()
          .getRepository("teams")
          .find({
            relations: {
              event: true,
              teamsParticipants: { participant: true },
            },
            where: { event: { id: event.id } },
            order: { id: "ASC" },
          })) as Team[];

        if (index >= 0 && index < 5) {
          for (const g of [1, 2, 3]) {
            const game = new Game();
            game.event = event;
            game.name = `game_${g}`;
            await dataSource.createEntityManager().save<Game>(game);

            if (g === 1) {
              for (const team of teams.slice(0, 2)) {
                const gameTeam = new GameTeam();
                gameTeam.game = game;
                gameTeam.team = team;
                await dataSource.createEntityManager().save<GameTeam>(gameTeam);

                for (const [k, tp] of team.teamsParticipants.entries()) {
                  if (k === 2) {
                    const gameStat = new GameStat();
                    gameStat.teamParticipant = tp;
                    gameStat.game = game;
                    gameStat.type = EGameEventType.GOAL;

                    await dataSource
                      .createEntityManager()
                      .save<GameStat>(gameStat);
                  } else if (k === 3) {
                    const gameStat = new GameStat();
                    gameStat.teamParticipant = tp;
                    gameStat.game = game;
                    gameStat.type = EGameEventType.ASSIST;
                    await dataSource
                      .createEntityManager()
                      .save<GameStat>(gameStat);
                  }
                }
              }
            } else if (g === 2) {
              for (const team of teams.slice(1, 3)) {
                const gameTeam = new GameTeam();
                gameTeam.game = game;
                gameTeam.team = team;
                await dataSource.createEntityManager().save<GameTeam>(gameTeam);

                for (const [k, tp] of team.teamsParticipants.entries()) {
                  if (k === 3) {
                    const gameStat = new GameStat();
                    gameStat.teamParticipant = tp;
                    gameStat.game = game;
                    gameStat.type = EGameEventType.GOAL;

                    await dataSource
                      .createEntityManager()
                      .save<GameStat>(gameStat);
                  } else if (k === 4) {
                    const gameStat = new GameStat();
                    gameStat.teamParticipant = tp;
                    gameStat.game = game;
                    gameStat.type = EGameEventType.ASSIST;
                    await dataSource
                      .createEntityManager()
                      .save<GameStat>(gameStat);
                  }
                }
              }
            } else {
              for (const team of teams.splice(1, 1)) {
                const gameTeam = new GameTeam();
                gameTeam.game = game;
                gameTeam.team = team;
                await dataSource.createEntityManager().save<GameTeam>(gameTeam);

                for (const [k, tp] of team.teamsParticipants.entries()) {
                  if (k === 1) {
                    const gameStat = new GameStat();
                    gameStat.teamParticipant = tp;
                    gameStat.game = game;
                    gameStat.type = EGameEventType.GOAL;

                    await dataSource
                      .createEntityManager()
                      .save<GameStat>(gameStat);
                  }
                }
              }
            }
          }
        } else if (index >= 5 && index < 8) {
          const game = new Game();
          game.event = event;
          game.name = `game_1`;
          await dataSource.createEntityManager().save<Game>(game);

          for (const team of teams) {
            const gameTeam = new GameTeam();
            gameTeam.game = game;
            gameTeam.team = team;
            await dataSource.createEntityManager().save<GameTeam>(gameTeam);

            for (const [k, tp] of team.teamsParticipants.entries()) {
              if (k === 2) {
                const gameStat = new GameStat();
                gameStat.teamParticipant = tp;
                gameStat.game = game;
                gameStat.type = EGameEventType.GOAL;

                await dataSource.createEntityManager().save<GameStat>(gameStat);
              } else if (k === 3) {
                const gameStat = new GameStat();
                gameStat.teamParticipant = tp;
                gameStat.game = game;
                gameStat.type = EGameEventType.ASSIST;
              }
            }
          }
        } else {
          continue;
        }
      }
      await dataSource
        .createEntityManager()
        .save<SeederModel>(new SeederModel(this.name));
    }
  }
}
