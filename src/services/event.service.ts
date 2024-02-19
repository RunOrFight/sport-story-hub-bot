import { Event } from "../database/entities/Event";
import db from "../database";

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
}

export const eventService = new EventService();
