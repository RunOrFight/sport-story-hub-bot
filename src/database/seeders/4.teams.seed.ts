import { Seeder } from "@jorgebodega/typeorm-seeding";
import { DataSource } from "typeorm";
import { Event } from "../entities/Event";
import { Seeder as SeederModel } from "../entities/Seeder";
import { Participant } from "../entities/Participant";
import { User } from "../entities/User";
import { Team } from "../entities/Team";
import { TeamParticipant } from "../entities/TeamParticipant";

export default class UserSeeder extends Seeder {
  private name = "add_teams";

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
        const eventParticipants = (await dataSource
          .createEntityManager()
          .getRepository("participants")
          .find({
            relations: { event: true },
            where: { event: { id: event.id } },
          })) as Participant[];

        if (index >= 0 && index < 5) {
          for (const j of [1, 2, 3]) {
            const team = new Team();
            team.event = event;
            team.name = `team_${j}`;
            await dataSource.createEntityManager().save<Team>(team);
            if (j === 1) {
              for (const ep of eventParticipants.slice(0, 5)) {
                const teamParticipant = new TeamParticipant();
                teamParticipant.team = team;
                teamParticipant.participant = ep;
                console.log(teamParticipant);
                await dataSource
                  .createEntityManager()
                  .save<TeamParticipant>(teamParticipant);
              }
            } else if (j === 2) {
              for (const ep of eventParticipants.slice(5, 10)) {
                const teamParticipant = new TeamParticipant();
                teamParticipant.team = team;
                teamParticipant.participant = ep;
                await dataSource
                  .createEntityManager()
                  .save<TeamParticipant>(teamParticipant);
              }
            } else {
              for (const ep of eventParticipants.slice(10, 15)) {
                const teamParticipant = new TeamParticipant();
                teamParticipant.team = team;
                teamParticipant.participant = ep;
                await dataSource
                  .createEntityManager()
                  .save<TeamParticipant>(teamParticipant);
              }
            }
          }
        } else if (index >= 5 && index < 8) {
          for (const j of [1, 2]) {
            const team = new Team();
            team.event = event;
            team.name = `team_${j}`;
            await dataSource.createEntityManager().save<Team>(team);

            if (j === 1) {
              for (const ep of eventParticipants.slice(0, 5)) {
                const teamParticipant = new TeamParticipant();
                teamParticipant.team = team;
                teamParticipant.participant = ep;
                await dataSource
                  .createEntityManager()
                  .save<TeamParticipant>(teamParticipant);
              }
            } else {
              for (const ep of eventParticipants.slice(5, 10)) {
                const teamParticipant = new TeamParticipant();
                teamParticipant.team = team;
                teamParticipant.participant = ep;
                await dataSource
                  .createEntityManager()
                  .save<TeamParticipant>(teamParticipant);
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
