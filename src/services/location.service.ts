import db from "../database";
import { Location } from "../database/entities/Location";
import {
  TLocationCreatePayload,
  TLocationDeletePayload,
  TLocationUpdatePayload,
} from "../types/location.types";
import { File } from "../database/entities/File";

export class LocationService {
  async getAllLocations(): Promise<Location[]> {
    return db.getRepository(Location).find({
      relations: {
        preview: true,
      },
    });
  }

  async createLocation(payload: TLocationCreatePayload): Promise<Location> {
    const { title, url, address, previewId } = payload;

    const location = new Location();
    location.title = title;
    location.url = url;
    location.address = address;

    if (previewId) {
      const preview = await db
        .getRepository(File)
        .findOne({ where: { id: previewId } });
      if (preview) {
        location.preview = preview;
      }
    }

    await db.getRepository(Location).save(location);
    return location;
  }

  async updateLocation(payload: TLocationUpdatePayload): Promise<Location> {
    const { id, title, url, address, previewId } = payload;

    const location = await db
      .getRepository(Location)
      .findOne({ relations: { preview: true }, where: { id } });

    if (!location) {
      throw new Error(`Location with id ${id} not found`);
    }

    location.title = title !== undefined ? title : location.title;
    location.url = url !== undefined ? url : location.url;
    location.address = address !== undefined ? address : location.address;

    if (previewId !== undefined) {
      if (previewId === null) {
        location.preview = null;
      } else if (!isNaN(previewId)) {
        const preview = await db
          .getRepository(File)
          .findOne({ where: { id: previewId } });
        if (preview) {
          location.preview = preview;
        }
      }
    }

    await db.getRepository(Location).save(location);
    return location;
  }

  async deleteLocation(payload: TLocationDeletePayload): Promise<boolean> {
    const { id } = payload;

    const location = await db
      .getRepository(Location)
      .findOne({ where: { id } });

    if (!location) {
      throw new Error(`Location with id ${id} not found`);
    }

    await db.getRepository(Location).delete({ id: location.id });
    return true;
  }
}
