import { File } from "../database/entities/File";
import db from "../database";
import { rm } from "fs/promises";

export class FileService {
  async addFile(payload: Express.Multer.File[]): Promise<File[]> {
    const savedFilesInDb: File[] = [];

    for (const file of payload) {
      if (!file.destination || !file.filename) {
        throw new Error("No destination or filename, data corrupted");
      }

      const newFile = new File();
      newFile.url = `${file.destination}/${file.filename}`;

      const savedFile = await db.getRepository(File).save(newFile);
      if (!savedFile) {
        throw new Error("File was not saved, please try again");
      }

      savedFilesInDb.push(savedFile);
    }

    return savedFilesInDb;
  }

  async deleteFile(id: number): Promise<boolean> {
    const file = await db.getRepository(File).findOneBy({ id });

    if (!file) {
      throw new Error(`Could not find file with id ${id}`);
    }

    await db.getRepository(File).delete(file);
    await rm(file.url);
    return true;
  }
}
