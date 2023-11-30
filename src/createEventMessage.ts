import {IEventFull} from "./types";
import {emoji} from "./emoji";

const getDate = (date: string) => {
    return new Date(date).toDateString()
}

const createEventMessage = ({dateTime, location, price, participants, participantsLimit, waitList}: IEventFull) => {
    try {
        return `
${emoji.time} ${getDate(dateTime)}
${emoji.location} ${location.title}, ${location.address} - <a rel="noopener noreferrer" href="${location.url}">map</a> 
${emoji.price} ${price}

Participants (${participants.length}/${participantsLimit}):
${participants.map((it) => `@${it.user.username}`).join("\n")}

Wait List (${waitList.length}):
${waitList.map((it) => `@${it.username}`).join("\n")}
`
    } catch (err) {
        throw err
    }
}

export {createEventMessage}
