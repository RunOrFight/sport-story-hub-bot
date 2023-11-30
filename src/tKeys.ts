const tKeys = {
    useButtonsHint: "useButtonsHint",
    webAppButton: "webAppButton",
    botMessageShare: "botMessageShare",
    eventMessageJoin: "eventMessageJoin",
    eventMessageLeave: "eventMessageLeave",
    eventMessageParticipants: "eventMessageParticipants",
    eventMessageWaitList: "eventMessageWaitList",
    eventMessageMap: "eventMessageMap"

} as const

const translates: Record<string, Record<string, string>> = {
    en: {
        useButtonsHint: "Use Buttons To Create Event",
        webAppButton: "Create Event",
        botMessageShare: "Share",
        eventMessageJoin: "Join",
        eventMessageLeave: "Leave",
    },
    ru: {
        useButtonsHint: "Используйте кнопки чтобы создать событие",
        webAppButton: "Создать событие",
        botMessageShare: "Поделиться",
        eventMessageJoin: "Я буду!",
        eventMessageLeave: "Планы поменялись",
        eventMessageParticipants: "Будут на игре",
        eventMessageWaitList: "Ожидают свободное место",
        eventMessageMap: "Посмотреть на карте"
    }
}
const t = (key: keyof typeof tKeys) => {
    return translates["ru"][key] ?? ""
}

export {tKeys, t}
