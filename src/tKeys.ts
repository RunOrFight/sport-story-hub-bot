const tKeys = {
  useButtonsHint: "useButtonsHint",
  webAppButton: "webAppButton",
  botMessageShare: "botMessageShare",
  eventMessageJoin: "eventMessageJoin",
  eventMessageLeave: "eventMessageLeave",
  eventMessageParticipants: "eventMessageParticipants",
  eventMessageWaitList: "eventMessageWaitList",
  eventMessageMap: "eventMessageMap",
  eventMessageWarning1: "eventMessageWarning1",
  eventMessageWarning2: "eventMessageWarning1",
  eventMessageInvited: "eventMessageInvited",
} as const;

const translates: Record<string, Record<string, string>> = {
  en: {
    useButtonsHint: "Use Buttons To Create Event",
    webAppButton: "Create Event",
    botMessageShare: "Share",
    eventMessageJoin: "+",
    eventMessageLeave: "-",
  },
  ru: {
    useButtonsHint: "Используйте кнопки чтобы создать событие",
    webAppButton: "Создать событие",
    botMessageShare: "Поделиться",
    eventMessageJoin: "➕",
    eventMessageLeave: "➖",
    eventMessageParticipants: "Будут на игре",
    eventMessageWaitList: "Ожидают свободное место",
    eventMessageMap: "Посмотреть на карте",
    eventMessageWarning1:
      "Это первая версия бота, возможны ошибки.\nПо всем вопросом писать @privetenn",
    eventMessageInvited: "+1 от",
  },
};
const t = (key: keyof typeof tKeys) => {
  return translates["ru"][key] ?? "";
};

export { tKeys, t };
