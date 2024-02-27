import { TUser } from "./Models/TUser.ts";
import { TEvent } from "./Models/TEvent.ts";
import { IError } from "./Models/IError.ts";
import { IUserInitResponse } from "../../src/types/user.types.ts";

const BASE_URL = import.meta.env.VITE_API_URL ?? "No url";

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
  getOrCreateUserByUsername: async (
    username: string,
  ): Promise<{ data: IUserInitResponse } | IError> => {
    const response = await fetch(`${BASE_URL}/user/init`, {
      body: JSON.stringify({ username }),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });

    if (!response.ok) {
      console.error(response.statusText);
      return { error: `User with username "${username}" doesn't exist` };
    }
    return await response.json();
  },
  joinEvent: async (payload: { username: string; eventId: number }) => {
    const response = await fetch(`${BASE_URL}/event/join-event`, {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    });
    console.log(response);
  },
  leaveEvent: async (payload: { username: string; eventId: number }) => {
    const response = await fetch(`${BASE_URL}/event/leave-event`, {
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
    });
    console.log(response);
  },
};

type THttpApi = typeof httpApi;

export { httpApi, type THttpApi };
