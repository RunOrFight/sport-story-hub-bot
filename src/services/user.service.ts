import db from "../database";
import { User } from "../database/entities/User";
import { EStatisticProperty } from "../enums/statistic-propery-enum";

class UserService {
  async getAllUsers(): Promise<Omit<User, "createdAt" | "updatedAt">[]> {
    return db
      .getRepository(User)
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.photo", "photo")
      .select([
        "user.id",
        "user.username",
        "user.name",
        "user.surname",
        "user.wins",
        "user.losses",
        "user.draws",
        "user.winRate",
        "user.total",
        "user.goals",
        "user.assists",
        "user.Elo",
        "photo.id",
        "photo.url",
      ])
      .getMany();
  }

  async getUserById(id: number): Promise<Omit<User, "createdAt" | "updatedAt">> {
    const user = await db
      .getRepository(User)
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.photo", "photo")
      .select([
        "user.id",
        "user.username",
        "user.name",
        "user.surname",
        "user.wins",
        "user.losses",
        "user.draws",
        "user.winRate",
        "user.total",
        "user.goals",
        "user.assists",
        "user.Elo",
        "photo.id",
        "photo.url",
      ])
      .where("user.id = :id", { id })
      .getOne();

    if (!user) {
      throw new Error(`User with id: ${id} not found`);
    }

    return user;
  }

  async getUserByUsername(username: string): Promise<Omit<User, "createdAt" | "updatedAt">> {
    const user = await db
      .getRepository(User)
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.photo", "photo")
      .select([
        "user.id",
        "user.username",
        "user.name",
        "user.surname",
        "user.wins",
        "user.losses",
        "user.draws",
        "user.winRate",
        "user.total",
        "user.goals",
        "user.assists",
        "user.Elo",
        "photo.id",
        "photo.url",
      ])
      .where("user.username = :username", { username })
      .getOne();

    if (!user) {
      throw new Error(`User with username: ${username} not found`);
    }

    return user;
  }



  async updateUserStatistic(
    id: number,
    statisticProperty: EStatisticProperty,
  ): Promise<boolean> {
    const user = await db.getRepository(User).findOneBy({ id });
    if (!user) {
      throw new Error("user not found");
    }

    switch (statisticProperty) {
      case EStatisticProperty.WINS:
        user.wins++;
        break;
      case EStatisticProperty.LOSSES:
        user.losses++;
        break;
    }

    // const updatedUser = await db.getRepository(User).update({id}, updatedFields)
    // console.log(updatedUser, 'UPDATED');
    return true;
  }
}

export const userService = new UserService();
