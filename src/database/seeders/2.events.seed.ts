import { Seeder } from "@jorgebodega/typeorm-seeding";
import { DataSource } from "typeorm";
import { Event } from "../entities/Event";
import { Seeder as SeederModel } from "../entities/Seeder";
import { EEventStatus } from "../../enums/event-status.enum";
import { Location } from "../entities/Location";
import { File } from "../entities/File";

export default class UserSeeder extends Seeder {
  private name = "add_events";

  async run(dataSource: DataSource) {
    const seedWasUsed = await dataSource
      .createEntityManager()
      .getRepository("seeders")
      .findOne({ where: { name: this.name } });
    if (!seedWasUsed) {
      const file = new File();
      file.url = "/src/assets/box365.jpeg";
      await dataSource.createEntityManager().save<File>(file);

      const location = new Location();
      location.url = "https://www.box365.by/";
      location.address = "sv9zistov 15, 181, Minsk";
      location.title = "Box365";
      location.preview = file;
      await dataSource.createEntityManager().save<Location>(location);

      const events: Event[] = [];

      for (let i = 0; i < 10; i++) {
        const newEvent = new Event();
        newEvent.status =
          i === 0
            ? EEventStatus.FINISHED
            : i === 1
              ? EEventStatus.STARTED
              : EEventStatus.WAITING;
        newEvent.dateTime = i === 5 ? undefined : new Date();
        newEvent.description = i === 5 ? undefined : "default description";
        newEvent.price = i === 5 ? undefined : "default price";
        newEvent.location = i === 6 ? undefined : location;
        newEvent.participantsLimit = i === 5 ? undefined : 15;

        events.push(newEvent);
      }
      await dataSource.createEntityManager().save<Event>(events);
      await dataSource
        .createEntityManager()
        .save<SeederModel>(new SeederModel(this.name));
    }
  }
}
