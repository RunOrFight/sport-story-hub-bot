import db from "../database";
import { User } from "../database/entities/User";
import { IUserInitResponseData, IUserUpdatePayload } from "../types/user.types";

export class UserService {
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

  async getUserById(
    id: number,
  ): Promise<Omit<User, "createdAt" | "updatedAt">> {
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

  async userInit(payload: {
    username: string;
  }): Promise<IUserInitResponseData> {
    const { username } = payload;
    const user = await db.getRepository(User).findOne({
      where: { username },
      relations: {
        photo: true,
      },
    });

    if (!user) {
      const newUser = new User();
      newUser.username = username;

      await db.getRepository(User).save(newUser);

      return { user: newUser, isNewUser: true };
    }

    return { user: user, isNewUser: false };
  }

  async updateUser(payload: IUserUpdatePayload): Promise<boolean> {
    const { username, name, surname } = payload;

    const user = await db.getRepository(User).findOneBy({ username });
    if (!user) {
      throw new Error("user not found");
    }

    if (name || name === null) {
      user.name = name;
    }

    if (surname || surname === null) {
      user.surname = surname;
    }

    await db.getRepository(User).save(user);
    return true;
  }
}
