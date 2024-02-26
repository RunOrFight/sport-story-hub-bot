import { Body, Delete, Get, Path, Post, Route, Tags } from "tsoa";
import { eventService } from "../services/event.service";

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

  @Post("/join-event")
  async joinEvent(@Body() payload: { eventId: number; username: string }) {
    const { eventId, username } = payload;
    return eventService.joinEvent(eventId, username);
  }

  @Delete("/leave-event")
  async leaveEvent(@Body() payload: { eventId: number; username: string }) {
    const { eventId, username } = payload;
    return eventService.leaveEvent(eventId, username);
  }
}
