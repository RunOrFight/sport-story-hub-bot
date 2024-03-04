import { Event } from "../database/entities/Event";
import db from "../database";
import { User } from "../database/entities/User";
import { Participant } from "../database/entities/Participant";
import {
  TEventCreatePayload,
  TEventDeletePayload, TEventParticipantJoin, TEventParticipantLeave,
  TEventUpdatePayload,
} from "../types/event.types";
import { Location } from "../database/entities/Location";

export class EventService {
  async getAllEvents(): Promise<Event[]> {
    return db.getRepository(Event).find({
      relations: {
        participants: { user: { photo: true } },
        location: { preview: true },
      },
    });
  }

  async getEventById(id: number): Promise<Event> {
    const event = await db.getRepository(Event).findOne({
      where: { id },
      relations: {
        games: {
          gameTeams: {
            team: {
              teamsParticipants: { participant: { user: { photo: true } } },
            },
          },
        },
        teams: {
          teamsParticipants: { participant: { user: { photo: true } } },
        },
        participants: { user: { photo: true } },
        location: { preview: true },
      },
      order: {
        participants: { id: "ASC" },
      },
    });

    if (!event) {
      throw new Error(`Event with id: ${id} not found`);
    }

    return event;
  }

  async getEventForTgBotMessage(eventId: number): Promise<Event> {
    const eventForMessage = await db.getRepository(Event).findOne({
      where: { id: eventId },
      relations: {
        location: { preview: true },
        participants: {
          user: { photo: true },
          parentParticipant: { user: true },
        },
      },
      order: {
        participants: { id: "ASC" },
      },
    });

    if (!eventForMessage) {
      throw new Error(`Event with id: ${eventId} not found`);
    }

    return eventForMessage;
  }

  async joinEvent(payload: TEventParticipantJoin): Promise<boolean> {
    const { username, eventId } = payload;
    const user = await db.getRepository(User).findOne({ where: { username } });
    if (!user) {
      throw new Error(`User ${username} not found`);
    }

    const event = await db.getRepository(Event).findOne({
      where: { id: eventId },
      relations: {
        participants: { user: true },
      },
    });

    if (!event) {
      throw new Error(`Event with id: ${eventId} not found`);
    }

    const userParticipant = event.participants.find(
      (p) => p.user?.username === user.username,
    );

    const participant = new Participant();
    participant.event = event;

    if (userParticipant) {
      participant.user = null;
      participant.parentParticipant = userParticipant;
    } else {
      participant.user = user;
    }

    await db.getRepository(Participant).save(participant);
    return true;
  }

  async leaveEvent(payload: TEventParticipantLeave): Promise<boolean> {
    const { username, eventId } = payload;
    const participants = await db.getRepository(Participant).find({
      relations: {
        user: true,
        event: true,
        parentParticipant: { user: true },
      },
      where: [
        { event: { id: eventId }, user: { username } },
        { event: { id: eventId }, parentParticipant: { user: { username } } },
      ],
      order: {
        id: "DESC",
      },
    });

    if (!participants.length) {
      throw new Error(`User is not a participant of this event`);
    }

    await db.getRepository(Participant).remove(participants[0]);
    return true;
  }

  async createEvent(payload: TEventCreatePayload): Promise<Event> {
    const { dateTime, price, description, participantsLimit, locationId } =
      payload;

    const event = new Event();
    event.dateTime = dateTime;
    event.price = price;
    event.description = description;
    event.participantsLimit = participantsLimit;

    if (locationId) {
      const location = await db
        .getRepository(Location)
        .findOne({ where: { id: locationId } });
      if (!location) {
        throw new Error(`Location with id ${locationId} not found`);
      }
      event.location = location;
    }

    const createdEvent = await db.getRepository(Event).save(event);

    if (!createdEvent) {
      throw new Error("Event was not created");
    }

    return createdEvent;
  }

  async updateEvent(payload: TEventUpdatePayload): Promise<Event> {
    const {
      id,
      dateTime,
      price,
      description,
      participantsLimit,
      locationId,
      status,
    } = payload;

    const event = await db.getRepository(Event).findOneBy({ id });

    if (!event) {
      throw new Error(`Event with id ${id} not found`);
    }

    event.dateTime = dateTime !== undefined ? dateTime : event.dateTime;
    event.price = price !== undefined ? price : event.price;
    event.description =
      description !== undefined ? description : event.description;
    event.participantsLimit =
      participantsLimit !== undefined
        ? participantsLimit
        : event.participantsLimit;
    event.status = status !== undefined ? status : event.status;

    if (locationId !== undefined) {
      if (locationId === null) {
        event.location = null;
      } else if (!isNaN(locationId)) {
        const location = await db
          .getRepository(Location)
          .findOneBy({ id: locationId });
        if (location) {
          event.location = location;
        }
      }
    }

    const updatedEvent = await db.getRepository(Event).save(event);

    if (!updatedEvent) {
      throw new Error("Event was not created");
    }

    return updatedEvent;
  }

  async deleteEvent(payload: TEventDeletePayload): Promise<boolean> {
    const { id } = payload;

    const event = await db.getRepository(Event).findOneBy({ id });

    if (!event) {
      throw new Error(`Location with id ${id} not found`);
    }

    await db.getRepository(Event).delete({ id: event.id });
    return true;
  }
}
