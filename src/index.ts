import TelegramBot from "node-telegram-bot-api";
import dotenv from "dotenv"
import {isEvent} from "./typeGuards";
import {IEventWithParticipants} from "./types";
import {tKeys} from "./tKeys";
import {createEventMessage} from "./createEventMessage";
import {registerBotEventHandler} from "./logger";
import express from "express"
import cors from "cors"
import chalk from "chalk";

dotenv.config()

const bot = new TelegramBot(process.env.TELEGRAM_BOT_ACCESS_TOKEN!, {polling: true});
const app = express()

app.use(express.json())
app.use(cors())

//todo remove and use db
const events: Record<string, IEventWithParticipants> = {}

bot.on(...registerBotEventHandler('message', async (msg) => {
    const chatId = msg.chat.id;


    await bot.sendMessage(chatId, tKeys.useButtonsHint, {
        reply_markup: {
            keyboard: [
                [{text: tKeys.webAppButton, web_app: {url: process.env.WEB_APP_URL!}}]
            ],

        }
    })


}));

bot.on(...registerBotEventHandler("web_app_data", async (msg) => {
    const dataString = msg.web_app_data?.data

    if (!dataString) {
        throw "dataString is not received"
    }

    const parsedData = JSON.parse(dataString)
    if (!isEvent(parsedData)) {
        throw `parsedData from ${dataString} doesn't match to IEvent interface`
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
}))

const createQueryReplyMarkup = (eventId: string) => ({
    inline_keyboard: [
        [
            {text: tKeys.eventMessageJoin, callback_data: `join_${eventId}`},
            {
                text: tKeys.eventMessageLeave, callback_data: `leave_${eventId}`
            }]
    ]
})

bot.on(...registerBotEventHandler("inline_query", async (msg) => {
    const eventId = msg.query

    //todo read from db
    const event = events[eventId]

    if (!event) {
        throw `cannot find event with id: ${eventId}`
    }

    await bot.answerInlineQuery(msg.id, [{
        title: "Event", id: event.id,
        type: "article",
        input_message_content: {
            parse_mode: "HTML",
            message_text: createEventMessage(event)
        },
        reply_markup: createQueryReplyMarkup(event.id)

    }])
}))

bot.on(...registerBotEventHandler("callback_query", async (msg) => {
    if (!msg.from.username) {
        throw "message without username received"
    }

    const eventId = msg.data?.split("_")[1] ?? ""

    //todo read from db
    const event = events[eventId]
    if (!event) {
        throw `cannot find event with id: ${eventId}`
    }

    if (msg.data?.startsWith("join")) {
        if (event.participants.includes(msg.from.username)) {
            throw `username: ${msg.from.username} already in participants`
        }
        event.participants.push(msg.from.username)

    } else if (msg.data?.startsWith("leave")) {
        if (!(event.participants.includes(msg.from.username))) {
            throw `username: ${msg.from.username} not in participants`
        }
        event.participants = event.participants.filter((it: string) => it !== msg.from.username)

    }

    await bot.editMessageText(createEventMessage(event), {
        parse_mode: "HTML",
        inline_message_id: msg.inline_message_id,
        reply_markup: createQueryReplyMarkup(eventId),
    })
}))


app.get("/events", (req, res) => {
    // res.send(events)
    res.send("Hello World")
})

const expressAppPort = process.env.EXPRESS_APP_PORT!
app.listen(expressAppPort, () => {
    console.log(chalk.bgBlue("EXPRESS STARTED"), chalk.blue(`port -> "${expressAppPort}"`))
})

export default app
