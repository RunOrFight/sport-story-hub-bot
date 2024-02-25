import { TUser } from "./Models/TUser.ts";
import { TEvent } from "./Models/TEvent.ts";
import { IError } from "./Models/IError.ts";

const BASE_URL = "http://localhost:5555/api";

const httpApi = {
  getAllEvents: async (): Promise<{ events: TEvent[] }> => {
    const response = await fetch(`${BASE_URL}/event/all`);
    if (!response.ok) {
      console.error(response.statusText);

      return { events: [] };
    }
    return await response.json();
  },
  getEventById: async (eventId: string): Promise<{ event: TEvent } | null> => {
    const response = await fetch(`${BASE_URL}/event/getById/${eventId}`);
    if (!response.ok) {
      console.error(response.statusText);

      return null;
    }
    return await response.json();
  },
  getEventsLocations: async () => {
    const response = await fetch(`${BASE_URL}/locations`);

    return await response.json();
  },
  getAllUsers: async (): Promise<{ users: TUser[] }> => {
    const response = await fetch(`${BASE_URL}/user/all`);
    if (!response.ok) {
      console.error(response.statusText);

      return { users: [] };
    }
    return await response.json();
  },
  getUserByUsername: async (
    username: string,
  ): Promise<{ user: TUser } | IError> => {
    const response = await fetch(`${BASE_URL}/user/getByUserName/${username}`);
    if (!response.ok) {
      console.error(response.statusText);
      return { error: `User with username "${username}" doesn't exist` };
    }
    return await response.json();
  },
};

type THttpApi = typeof httpApi;

export { httpApi, type THttpApi };
