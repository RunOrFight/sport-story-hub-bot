import {EEventStatus, IEventFull, IEventLocation, ILeaderboardRow} from "./types.ts";
import {generateName} from "./Utils/GenerateName.ts";
import {getRandomInt} from "./Utils/GetRandomInt.ts";

const eventsLocations: IEventLocation[] = [
    {
        id: 234,
        title: "Box365",
        url: "https://maps.app.goo.gl/ZeLrHS4BzczpcHAD7",
        address: "ул. Октябрьская 16/3, Минск",
        preview: {
            id: 1,
            url: "https://images.prismic.io/box365/ada297cd-86e6-45a1-b9be-cc20376c8f51_D75_5384+copy-min.jpg?auto=compress,format&rect=445,0,4016,4016&w=1200&h=1200"
        }
    },
]

const events: IEventFull[] = [
    {
        id: 555,
        location: eventsLocations[0],
        status: EEventStatus.STARTED,
        dateTime: new Date(Date.now()).toDateString(),
        description: "We hold games in formats from 4x4 to 9x9 with varying durations from 60 to 120 minutes.",
        participants: [{
            id: 22, user: {username: "privetenn", photo: {url: "ageeag", id: 444}}
        }],
        participantsLimit: 10,
        price: "5 BYN"
    },
    {
        id: 555,
        location: eventsLocations[0],
        status: EEventStatus.STARTED,
        dateTime: new Date(Date.now()).toDateString(),
        description: "We hold games in formats from 4x4 to 9x9 with varying durations from 60 to 120 minutes.",
        participants: [{
            id: 22, user: {username: "privetenn", photo: {url: "ageeag", id: 444}}
        }],
        participantsLimit: 10,
        price: "5 BYN"
    }
]

const DELAY = 1_000

const withDelay = <T>(value: T): Promise<T> => {
    return new Promise((res) => {
        setTimeout(() => res(value), DELAY)
    })
}

const BASE_URL = 'http://localhost:5555/api'

// fetch(BASE_URL + '/locations').then((res) => {
//     console.log(res)
// })

const httpApi = {
    getEvents: async () => {
        return withDelay(events)
    },
    getEventById: async (id: number) => {
        return withDelay(events.find((it) => it.id === id))
    },
    getEventsLocations: async () => {
        const response = await fetch(`${BASE_URL}/locations`)

        return await response.json()
    },
    getLeaderboardRows: async (): Promise<ILeaderboardRow[]> => {
        const rows = new Array(99).fill(null).map((_, i) => (
            {
                place: i + 1,
                name: generateName(),
                winRate: getRandomInt(0, 100),
                score: getRandomInt(50, 200)
            }
        ))

        return withDelay(rows)
    }
}

export {httpApi}
