import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv"
import {isEvent} from "./typeGuards";
import {IEventWithParticipants} from "./types";
import {tKeys} from "./tKeys";
import {createErrorMessage} from "./createErrorMessage";
import {createEventMessage} from "./createEventMessage";

dotenv.config()

const bot = new TelegramBot(process.env.TELEGRAM_BOT_ACCESS_TOKEN!, {polling: true});

bot.on('message', async (msg) => {
    await bot.sendMessage(msg.chat.id, "Hello World")

    if (msg.web_app_data?.data) {
        return
    }

    try {
        const chatId = msg.chat.id;

        await bot.sendMessage(chatId, tKeys.useButtonsHint, {
            reply_markup: {
                keyboard: [
                    [{text: tKeys.webAppButton, web_app: {url: process.env.WEB_APP_URL!}}]
                ],
            }
        })
    } catch (err) {
        console.log(err)
        await bot.sendMessage(msg.chat.id, createErrorMessage("bot.on('message')"))
    }
});

//todo remove and use db
const events: Record<string, IEventWithParticipants> = {}

bot.on("web_app_data", async (msg) => {
    const dataString = msg.web_app_data?.data

    if (!dataString) {
        return
    }


    try {
        const parsedData = JSON.parse(dataString)
        if (!isEvent(parsedData)) {
            return
        }

        const event = {...parsedData, participants: []}

        //todo write to db
        events[parsedData.id] = event

        await bot.sendMessage(msg.chat.id, createEventMessage(event), {
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: [
                    [{switch_inline_query: parsedData.id, text: tKeys.botMessageShare}]
                ]
            }
        })

    } catch (err) {
        console.log(err)
        await bot.sendMessage(msg.chat.id, createErrorMessage("bot.on('web_app_data')"))
    }
})

const createQueryReplyMarkup = (eventId: string) => ({
    inline_keyboard: [
        [
            {text: tKeys.eventMessageJoin, callback_data: `join_${eventId}`},
            {
                text: tKeys.eventMessageLeave, callback_data: `leave_${eventId}`
            }]
    ]
})

bot.on("inline_query", async (msg) => {
    const eventId = msg.query

    //todo read from db
    const event = events[eventId]

    if (!event) {
        return
    }

    try {
        await bot.answerInlineQuery(msg.id, [{
            title: "Event", id: event.id,
            type: "article",
            input_message_content: {
                parse_mode: "HTML",
                message_text: createEventMessage(event)
            },
            reply_markup: createQueryReplyMarkup(event.id)

        }])
    } catch (err) {
        console.log(err)
        await bot.sendMessage(msg.id, createErrorMessage("bot.on('inline_query')"))
    }
})

bot.on("callback_query", async (msg) => {
    if (!msg.from.username) {
        return
    }

    const eventId = msg.data?.split("_")[1] ?? ""

    //todo read from db
    const event = events[eventId]

    if (!event) {
        return
    }

    try {
        if (msg.data?.startsWith("join")) {
            if (event.participants.includes(msg.from.username)) {
                return
            }
            event.participants.push(msg.from.username)

        } else if (msg.data?.startsWith("leave")) {
            if (!(event.participants.includes(msg.from.username))) {
                return
            }
            event.participants = event.participants.filter((it: string) => it !== msg.from.username)

        }

        await bot.editMessageText(createEventMessage(event), {
            parse_mode: "HTML",
            inline_message_id: msg.inline_message_id,
            reply_markup: createQueryReplyMarkup(eventId),
        })

    } catch (err) {
        console.log(err)
        if (msg.message?.chat.id) {
            await bot.sendMessage(msg.message.chat.id, createErrorMessage("bot.on('callback_query')"))
        }
    }
})
