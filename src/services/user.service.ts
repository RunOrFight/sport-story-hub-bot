import db from "../database";
import { User } from "../database/entities/User";
import {
  TUserInitResponse,
  TUserInitResponseData,
  TUserUpdatePayload,
} from "../types/user.types";
import { File } from "../database/entities/File";

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
  }): Promise<TUserInitResponseData> {
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

  async updateUser(payload: TUserUpdatePayload): Promise<User> {
    const { username, name, surname, photoId } = payload;

    const user = await db.getRepository(User).findOneBy({ username });
    if (!user) {
      throw new Error(`User with username: ${username} not found`);
    }

    user.name = name !== undefined ? name : user.name;
    user.surname = surname !== undefined ? surname : user.surname;

    if (photoId !== undefined) {
      if (photoId === null) {
        user.photo = null;
      } else if (!isNaN(photoId)) {
        const photo = await db
          .getRepository(File)
          .findOne({ where: { id: photoId } });
        if (photo) {
          user.photo = photo;
        }
      }
    }

    await db.getRepository(User).save(user);
    return user;
  }
}
