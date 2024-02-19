import { Get, Path, Route, Tags } from "tsoa";
import { eventService } from "../services/event.service";
import { userService } from "../services/user.service";

@Route("/api/event")
@Tags("Events")
export class EventController {
  @Get("/all")
  async getAllEvents() {
    return eventService.getAllEvents();
  }

  @Get("/getById/{id}")
  async getEventById(@Path() id: number) {
    return eventService.getEventById(id);
  }
}
