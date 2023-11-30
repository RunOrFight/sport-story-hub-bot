import {IEventFull} from "./types";
import {emoji} from "./emoji";

const getDate = (date: string) => {
    return new Date(date).toDateString()
}

const createEventMessage = ({dateTime, location, price, participants, participantsLimit}: IEventFull) => {
    return `
${emoji.time} ${getDate(dateTime)}
${emoji.location} ${location.title}, ${location.address} - <a rel="noopener noreferrer" href="${location.url}">map</a> 
${emoji.price} ${price}

Participants (${participants.length}/${participantsLimit}):
${participants.map((it) => `@${it}`).join("\n")}
`
}

export {createEventMessage}
