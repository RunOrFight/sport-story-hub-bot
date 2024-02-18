import { Seeder } from "@jorgebodega/typeorm-seeding";
import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Seeder as SeederModel } from "../entities/Seeder";

export default class UserSeeder extends Seeder {
  private name = "add_basic_users";

  async run(dataSource: DataSource) {
    const seedWasUsed = await dataSource.createEntityManager().getRepository('seeders').findOne({ where: { name: this.name } });
    if (!seedWasUsed) {
      const fakeNames = ["Vas9", "Pet9", "Andrew", "Max", "Bobby"];
      const fakeSurnames = ["Rijiy", "Jirniy", "Valenok", "Mad", "Dilan"];
      const users = [];

      for (let i = 0; i < 10; i++) {
        const newUser = new User();
        newUser.username = `user_${i + 1}`;
        newUser.name = i < 5 ? fakeNames[i] : undefined;
        newUser.surname = i < 5 ? fakeSurnames[i] : undefined;
        newUser.wins = Math.min(Math.floor(Math.random() * 100), 100);
        newUser.losses = Math.min(Math.floor(Math.random() * 100), 100);
        newUser.draws = Math.min(Math.floor(Math.random() * 100), 100);
        newUser.goals = Math.min(Math.floor(Math.random() * 100), 100);
        newUser.assists = Math.min(Math.floor(Math.random() * 100), 100);
        newUser.Elo = Math.min(Math.floor(Math.random() * 3000), 3000);

        users.push(newUser);
      }
      await dataSource.createEntityManager().save<User>(users);
      await dataSource.createEntityManager().save<SeederModel>(new SeederModel(this.name));
    }
  }
}
