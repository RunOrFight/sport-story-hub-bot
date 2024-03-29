import { Body, Delete, Get, Path, Post, Put, Route, Tags } from "tsoa";
import { EventService } from "../services/event.service";
import {
  TEventCreatePayload,
  TEventDeletePayload, TEventParticipantJoin, TEventParticipantLeave,
  TEventUpdatePayload,
} from "../types/event.types";

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
  async joinEvent(@Body() payload: TEventParticipantJoin) {
    return this.eventService.joinEvent(payload);
  }

  @Delete("/leave-event")
  async leaveEvent(@Body() payload: TEventParticipantLeave) {
    return this.eventService.leaveEvent(payload);
  }

  @Post("/create")
  async createEvent(@Body() payload: TEventCreatePayload) {
    return this.eventService.createEvent(payload);
  }

  @Put("/update")
  async updateEvent(@Body() payload: TEventUpdatePayload) {
    return this.eventService.updateEvent(payload);
  }

  @Delete("/delete")
  async deleteEvent(@Body() payload: TEventDeletePayload) {
    return this.eventService.deleteEvent(payload);
  }
}
