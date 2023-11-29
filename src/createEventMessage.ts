import {IEventWithParticipants} from "./types";

const getDateFromMsString = (date: Date) => {
    return date.toDateString()
}

const createEventMessage = ({date, place, price, participants, participantsCount}: IEventWithParticipants) => {
    return `
Date: <b>${getDateFromMsString(date)}</b>
Place: <b>${place}</b>
Price: <b>${price}</b>

Participants (${participants.length}/${participantsCount}):
${participants.map((it) => `@${it}`).join("\n")}`
}

export {createEventMessage}
