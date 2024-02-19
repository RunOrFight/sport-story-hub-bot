import { Seeder } from "@jorgebodega/typeorm-seeding";
import { DataSource } from "typeorm";
import { Event } from "../entities/Event";
import { Seeder as SeederModel } from "../entities/Seeder";
import { EEventStatus } from "../../enums/event-status.enum";
import { Location } from "../entities/Location";
import { File } from "../entities/File";
import { Participant } from "../entities/Participant";
import { User } from "../entities/User";

export default class UserSeeder extends Seeder {
  private name = "add_participants_to_events";

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

      const users = (await dataSource
        .createEntityManager()
        .getRepository("users")
        .find()) as User[];

      for (const [index, event] of events.entries()) {
        if (index >= 0 && index < 5) {
          for (const user of users) {
            const participant = new Participant();
            participant.user = user;
            participant.event = event;
            await dataSource
              .createEntityManager()
              .save<Participant>(participant);
          }
        } else if (index >= 5 && index < 8) {
          for (const [j, user] of users.entries()) {
            if (j >= 10) {
              continue;
            }
            const participant = new Participant();
            participant.user = user;
            participant.event = event;
            await dataSource
              .createEntityManager()
              .save<Participant>(participant);
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
