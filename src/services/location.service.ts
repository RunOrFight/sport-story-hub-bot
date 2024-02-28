import db from "../database";
import { Location } from "../database/entities/Location";

export class LocationService {
  async getAllLocations(): Promise<Location[]> {
    return db.getRepository(Location).find({
      relations: {
        preview: true,
      },
    });
  }
}
