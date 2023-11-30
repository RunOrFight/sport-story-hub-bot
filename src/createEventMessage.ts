import {Event} from "./database/entities/Event";
import {emoji} from "./emoji";
import {t, tKeys} from "./tKeys";
import "dayjs/locale/ru"

const getDate = (date: Date) => {
    return new Date(date).toDateString()
}

const createEventMessage = ({dateTime, location, price, participants, participantsLimit}: Event) => {
    try {
        const baseString = `
${emoji.time} ${getDate(dateTime)}
${emoji.location} ${location.title}, ${location.address} 
<a rel="noopener noreferrer" href="${location.url}">${t(tKeys.eventMessageMap)}</a> 
${emoji.price} ${price}

${emoji.warning} ${t(tKeys.eventMessageWarning1)} ${t(tKeys.eventMessageWarning2)}

${emoji.participants} ${t(tKeys.eventMessageParticipants)} (${participants.filter((pt) => !pt.waitList).length}/${participantsLimit}):
${participants.filter((pt) => !pt.waitList).map((it) => `@${it.user.username}`).join("\n")}
`
        const waitListString = `
${emoji.waitList} ${t(tKeys.eventMessageWaitList)} (${participants.filter((pt) => pt.waitList).length}):
${participants.filter((pt) => pt.waitList).map((it) => `@${it.user.username}`).join("\n")}
`
        return participants.filter((pt) => pt.waitList).length !== 0 ? baseString + waitListString : baseString
    } catch (err) {
        console.error(err);
        throw err
    }

}

export {createEventMessage}
