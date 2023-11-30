import {IEventFull} from "./types";

const getDate = (date: string) => {
    return new Date(date).toDateString()
}

const createEventMessage = ({dateTime, location, price, participants, participantsLimit}: IEventFull) => {
    return `
Date: <b>${getDate(dateTime)}</b>
Place: <b>${location.title}</b>
Price: <b>${price}</b>

Participants (${participants.length}/${participantsLimit}):
${participants.map((it) => `@${it}`).join("\n")}`
}

export {createEventMessage}
