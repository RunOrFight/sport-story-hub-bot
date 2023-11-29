import dotenv from "dotenv"
import TelegramBot from "node-telegram-bot-api";
import {IEventWithParticipants} from "./types";
import {registerBotEventHandler} from "./logger";
import {tKeys} from "./tKeys";
import {isEvent} from "./typeGuards";
import {createEventMessage} from "./createEventMessage";
import express from "express"
import cors from "cors"
import chalk from "chalk";
import {connectToDb} from "./db-connect";
import {DataSource} from "typeorm";
import {Event} from './entities/Event'
import {User} from "./entities/User";


dotenv.config()

const app = express()

app.use(express.json())
app.use(cors());

const dataSource = new DataSource({
    type: "postgres",
    host: 'localhost',
    port: 5432,
    database: "sport_hub",
    username: "admin",
    logging: true,
    synchronize: true,
    entities: ["./src/entities/**/*.ts"],
});

(async function () {
    await connectToDb(dataSource);

    // const users = await dataSource.getRepository(User).createQueryBuilder('users').leftJoinAndSelect('users.photo', 'photo').getMany();
    // const qwe = await dataSource.getRepository(Event).createQueryBuilder('events')
    //     .leftJoinAndSelect('events.participants', 'participants')
    //     .leftJoinAndSelect('participants.user', 'user')
    //     .leftJoinAndSelect('user.photo', 'photo')
    //     .getOne();
    // console.log(JSON.stringify(qwe, null, 3))
    //todo remove and use db
    const events: Record<string, IEventWithParticipants> = {}
    app.get('/api', (_req, res) => {
        const path = `/api/events`;
        res.setHeader('Content-Type', 'text/html');
        res.setHeader('Cache-Control', 's-max-age=1, stale-while-revalidate');
        res.end(`Hello! Go to events: <a href="${path}">${path}</a>`);
    });

    app.get("/api/events", (_req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({name: 'John Doe'});
    })


    const bot = new TelegramBot(process.env.TELEGRAM_BOT_ACCESS_TOKEN!, {polling: true});
    console.log("Telegram Bot Created")


//todo remove and use db

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

        const parsedData: any = JSON.parse(dataString)
        // if (!isEvent(parsedData)) {
        //     throw `parsedData from ${dataString} doesn't match to IEvent interface`
        // }

        console.log(parsedData);

        const event = new Event();

        event.date = parsedData.date;
        event.price = parsedData.price;
        // event.place = parsedData.place;
        // event.currency = parsedData.currency;
        // event.participantsCount = parsedData.participantsCount;

        //todo write to db
        // await dataSource.getRepository(Event).save(event)
        // @ts-ignore
        // await bot.sendMessage(msg.chat.id, createEventMessage({...parsedData, participants: []}), {
        //     parse_mode: "HTML",
        //     reply_markup: {
        //         inline_keyboard: [
        //             [{switch_inline_query: parsedData.id, text: tKeys.botMessageShare}]
        //         ]
        //     }
        // })
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

        // @ts-ignore
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
        res.send(events)
    })

    const expressAppPort = process.env.EXPRESS_APP_PORT!
    app.listen(expressAppPort, () => {
        console.log(chalk.bgBlue("EXPRESS STARTED"), chalk.blue(`port -> "${expressAppPort}"`))
    })

})();




