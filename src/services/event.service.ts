import { Event } from "../database/entities/Event";
import db from "../database";
import { User } from "../database/entities/User";
import { Participant } from "../database/entities/Participant";

class EventService {
  async getAllEvents(): Promise<Event[]> {
    return db.getRepository(Event).find({
      relations: { participants: { user: { photo: true } } },
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
      },
    });

    if (!event) {
      throw new Error(`Event with id: ${id} not found`);
    }

    return event;
  }

  async joinEvent(eventId: number, username: string): Promise<boolean> {
    const user = await db.getRepository(User).findOne({ where: { username } });
    if (!user) {
      throw new Error(`User ${username} not found`);
    }

    const event = await db.getRepository(Event).findOne({
      where: { id: eventId },
      relations: {
        participants: true,
      },
    });

    if (!event) {
      throw new Error(`Event with id: ${eventId} not found`);
    }

    const participant = new Participant();
    participant.event = event;
    participant.user = user;
    if (
      event.participantsLimit &&
      event.participants.length >= event.participantsLimit
    ) {
      participant.waitList = true;
    }

    await db.getRepository(Participant).save(participant);
    return true;
  }

  async leaveEvent(eventId: number, username: string): Promise<boolean> {
    const participant = await db.getRepository(Participant).findOne({
      relations: {
        user: true,
        event: true,
      },
      where: { user: { username }, event: { id: eventId } },
    });

    if (!participant) {
      throw new Error(`User is not a participant of this event`);
    }

    await db.getRepository(Participant).delete(participant.id);
    return true;
  }
}

export const eventService = new EventService();
