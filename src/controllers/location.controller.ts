import { Get, Route, Tags } from "tsoa";
import { LocationService } from "../services/location.service";

@Route("/api/location")
@Tags("Locations")
export class LocationController {
  private locationService = new LocationService();

  @Get("/all")
  async getAllLocations() {
    return this.locationService.getAllLocations();
  }
}
