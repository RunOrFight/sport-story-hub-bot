import { Body, Delete, Get, Post, Put, Route, Tags } from "tsoa";
import { LocationService } from "../services/location.service";
import {
  TLocationCreatePayload,
  TLocationDeletePayload,
  TLocationUpdatePayload,
} from "../types/location.types";

@Route("/api/location")
@Tags("Locations")
export class LocationController {
  private locationService = new LocationService();

  @Get("/all")
  async getAllLocations() {
    return this.locationService.getAllLocations();
  }

  @Post("/create")
  async createLocation(@Body() payload: TLocationCreatePayload) {
    return this.locationService.createLocation(payload);
  }

  @Put("/update")
  async updateLocation(@Body() payload: TLocationUpdatePayload) {
    return this.locationService.updateLocation(payload);
  }

  @Delete("/delete")
  async deleteLocation(@Body() payload: TLocationDeletePayload) {
    return this.locationService.deleteLocation(payload);
  }
}
