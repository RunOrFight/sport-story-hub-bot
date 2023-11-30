import dotenv from "dotenv"
import TelegramBot from "node-telegram-bot-api";
import {registerBotEventHandler} from "./logger";
import {tKeys} from "./tKeys";
import {createEventMessage} from "./createEventMessage";
import express from "express"
import cors from "cors"
import chalk from "chalk";
import {DataSource} from "typeorm";
import {Event} from './entities/Event'
import {IEventFull, IUser} from "./types";
import {assertIsRawEvent} from "./typeGuards";
import {createFullEvent} from "./createFullEvent";

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
    // await connectToDb(dataSource);

    // const users = await dataSource.getRepository(User).createQueryBuilder('users').leftJoinAndSelect('users.photo', 'photo').getMany();
    // const qwe = await dataSource.getRepository(Event).createQueryBuilder('events')
    //     .leftJoinAndSelect('events.participants', 'participants')
    //     .leftJoinAndSelect('participants.user', 'user')
    //     .leftJoinAndSelect('user.photo', 'photo')
    //     .getOne();
    // console.log(JSON.stringify(qwe, null, 3))
    //todo remove and use db
    const events: Record<string, IEventFull> = {}
    const users: IUser[] = []

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
    console.log(chalk.bgCyan("TELEGRAM BOT CREATED"))


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

        const parsedData = assertIsRawEvent(JSON.parse(dataString))
        const fullEvent = createFullEvent(parsedData)

        // const event = new Event();

        // event.date = parsedData.date;
        // event.price = parsedData.price;
        // event.place = parsedData.place;
        // event.currency = parsedData.currency;
        // event.participantsCount = parsedData.participantsCount;
        // await dataSource.getRepository(Event).save(event)


        //todo write to db
        events[fullEvent.id] = fullEvent

        await bot.sendMessage(msg.chat.id, createEventMessage(fullEvent), {
            parse_mode: "HTML",
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [
                    //todo eventId
                    [{switch_inline_query: fullEvent.id.toString(), text: tKeys.botMessageShare}]
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
            title: "Event", id: event.id.toString(),
            type: "article",
            input_message_content: {
                parse_mode: "HTML",
                disable_web_page_preview: true,
                message_text: createEventMessage(event)
            },
            reply_markup: createQueryReplyMarkup(event.id.toString())

        }])
    }))

    bot.on(...registerBotEventHandler("callback_query", async (msg) => {
        if (!msg.from.username) {
            throw "message without username received"
        }

        let user = users.find((it) => it.username === msg.from.username)!

        if (!user) {
            user = {username: msg.from.username}
            users.push(user)
        }

        const eventId = msg.data?.split("_")[1] ?? ""

        //todo read from db
        const event = events[eventId]
        if (!event) {
            throw `cannot find event with id: ${eventId}`
        }


        const usernameInParticipants = event.participants.find((it) => it.user.username === user.username)

        if (msg.data?.startsWith("join")) {

            if (event.participants.length >= event.participantsLimit) {
                event.waitList.push(user)
            } else {
                if (usernameInParticipants) {
                    throw `username: ${msg.from.username} already in participants`
                }

                event.participants.push({user, id: 1})
            }


        } else if (msg.data?.startsWith("leave")) {

            if (event.waitList.find((it) => it.username === user.username)) {
                event.waitList = event.waitList.filter((it) => it.username !== user.username)
            } else if (usernameInParticipants) {
                event.participants = event.participants.filter((it) => it.user.username !== user.username)

                if (event.waitList.length !== 0 && event.participants.length === event.participantsLimit - 1) {
                    event.participants.push({user: event.waitList[0], id: 123})
                    event.waitList = event.waitList.filter((it) => it.username !== user.username)
                }
            }

        }

        await bot.editMessageText(createEventMessage(event), {
            parse_mode: "HTML",
            disable_web_page_preview: true,
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
