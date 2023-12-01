import {Event} from "./database/entities/Event";
import {emoji} from "./emoji";
import {t, tKeys} from "./tKeys";
import "dayjs/locale/ru"
import dayjs from "dayjs";

const getDate = (date: Date) => {
    return dayjs(date).locale("ru").format("D MMM(dddd), HH:mm")
}

const createEventMessage = ({dateTime, location, price, participants, participantsLimit}: Event) => {
    const baseString = `
${emoji.time} ${getDate(dateTime)}
${emoji.location} ${location.title}, ${location.address} 
<a rel="noopener noreferrer" href="${location.url}">${t(tKeys.eventMessageMap)}</a> 
${emoji.price} ${price}

${emoji.warning} ${t(tKeys.eventMessageWarning1)}

${emoji.participants} ${t(tKeys.eventMessageParticipants)} (${participants.filter((pt) => !pt.waitList).length}/${participantsLimit}):
${participants.filter((pt) => !pt.waitList).map((it) => `@${it.user.username}`).join("\n")}
`
    const waitListString = `
${emoji.waitList} ${t(tKeys.eventMessageWaitList)} (${participants.filter((pt) => pt.waitList).length}):
${participants.filter((pt) => pt.waitList).map((it) => `@${it.user.username}`).join("\n")}
`
    return participants.filter((pt) => pt.waitList).length !== 0 ? baseString + waitListString : baseString
}

export {createEventMessage}
