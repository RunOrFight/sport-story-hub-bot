import {IEventFull} from "./types";
import {emoji} from "./emoji";
import {t, tKeys} from "./tKeys";
import dayjs from "dayjs";
import "dayjs/locale/ru"

const getDate = (date: string) => {
    return dayjs(date).locale("ru").format("D MMM(dddd), HH:mm")
}

const createEventMessage = ({dateTime, location, price, participants, participantsLimit, waitList}: IEventFull) => {
    const baseString = `
${emoji.time} ${getDate(dateTime)}
${emoji.location} ${location.title}, ${location.address} 
<a rel="noopener noreferrer" href="${location.url}">${t(tKeys.eventMessageMap)}</a> 
${emoji.price} ${price}

${emoji.participants} ${t(tKeys.eventMessageParticipants)} (${participants.length}/${participantsLimit}):
${participants.map((it) => `@${it.user.username}`).join("\n")}
`
    const waitListString = `
${emoji.waitList} ${t(tKeys.eventMessageWaitList)} (${waitList.length}):
${waitList.map((it) => `@${it.username}`).join("\n")}
`
    return waitList.length !== 0 ? baseString + waitListString : baseString

}

export {createEventMessage}
