import { Body, Delete, Get, Path, Post, Route, Tags } from "tsoa";
import { EventService } from "../services/event.service";

@Route("/api/event")
@Tags("Events")
export class EventController {
  private eventService = new EventService();

  @Get("/all")
  async getAllEvents() {
    return this.eventService.getAllEvents();
  }

  @Get("/getById/{id}")
  async getEventById(@Path() id: number) {
    return this.eventService.getEventById(id);
  }

  @Post("/join-event")
  async joinEvent(@Body() payload: { eventId: number; username: string }) {
    const { eventId, username } = payload;
    return this.eventService.joinEvent(eventId, username);
  }

  @Delete("/leave-event")
  async leaveEvent(@Body() payload: { eventId: number; username: string }) {
    const { eventId, username } = payload;
    return this.eventService.leaveEvent(eventId, username);
  }
}
