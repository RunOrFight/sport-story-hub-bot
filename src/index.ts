import dotenv from "dotenv"
import TelegramBot from "node-telegram-bot-api";
import {registerBotEventHandler} from "./logger";
import {t, tKeys} from "./tKeys";
import {createEventMessage} from "./createEventMessage";
import express from "express"
import cors from "cors"
import chalk from "chalk";
import {Event} from './database/entities/Event'
import {User} from './database/entities/User'
import {Location} from "./database/entities/Location";
import db from './database'
import "reflect-metadata";
import {Participant} from "./database/entities/Participant";


dotenv.config()

const app = express()


app.use(express.json())
app.use(cors());

(async function () {
    await db.initialize();


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

    bot.on(...registerBotEventHandler('message', async (msg) => {
        const chatId = msg.chat.id;


        await bot.sendMessage(chatId, t(tKeys.useButtonsHint), {
            reply_markup: {
                keyboard: [
                    [{text: t(tKeys.webAppButton), web_app: {url: process.env.WEB_APP_URL!}}]
                ],
            }
        })
    }));

    bot.on(...registerBotEventHandler("web_app_data", async (msg) => {
        const dataString = msg.web_app_data?.data

        if (!dataString) {
            throw "dataString is not received"
        }

        const parsedData = JSON.parse(dataString);
        const locationRepository = db.getRepository(Location);
        // TODO: edit 1 to parsedData.locationId
        const location = await locationRepository.findOne({where: {id: 1}});

        if (!location) {
            throw new Error('erere');
        }

        const newEvent = new Event();

        newEvent.location = location;
        newEvent.dateTime = parsedData.dateTime;
        newEvent.price = parsedData.price;
        newEvent.participantsLimit = parsedData.participantsLimit;
        newEvent.description = parsedData.description;
        await db.getRepository(Event).save(newEvent)


        const event = await db.getRepository(Event).createQueryBuilder('events')
            .where("events.id = :id", {id: newEvent.id})
            .leftJoinAndSelect('events.location', 'location')
            .leftJoinAndSelect('location.preview', 'preview')
            .leftJoinAndSelect('events.participants', 'participants')
            .leftJoinAndSelect('participants.user', 'user')
            .leftJoinAndSelect('events.waitList', 'waitList')
            .leftJoinAndSelect('waitList.user', 'waitListUser')
            .leftJoinAndSelect('user.photo', 'photo')
            .getOne();


        if (!event) {
            throw new Error('eroeroe');
        }


        // console.log(JSON.stringify(event, null, 4));
        // id: 2,
        //     location: {
        //     id: 234,
        //         title: 'Box365',
        //         url: 'https://maps.app.goo.gl/ZeLrHS4BzczpcHAD7',
        //         address: 'ул. Октябрьская 16/3, Минск',
        //         preview: {
        //         id: 1,
        //             url: 'https://images.prismic.io/box365/ada297cd-86e6-45a1-b9be-cc20376c8f51_D75_5384+copy-min.jpg?auto=compress,format&rect=445,0,4016,4016&w=1200&h=1200'
        //     }
        // },
        // price: '5 BYN',
        //     participantsLimit: 10,
        //     dateTime: '2023-11-30T17:30:38.735Z',
        //     description: 'Regular Match',
        //     status: 'waiting',
        //     participants: []

        await bot.sendMessage(msg.chat.id, createEventMessage(event), {
            parse_mode: "HTML",
            disable_web_page_preview: true,
            reply_markup: {
                inline_keyboard: [
                    [{switch_inline_query: event.id.toString(), text: tKeys.botMessageShare}]
                ]
            }
        })
    }))

    const createQueryReplyMarkup = (eventId: string) => ({
        inline_keyboard: [
            [
                {text: t(tKeys.eventMessageJoin), callback_data: `join_${eventId}`},
                {
                    text: t(tKeys.eventMessageLeave), callback_data: `leave_${eventId}`
                }]
        ]
    })

    bot.on(...registerBotEventHandler("inline_query", async (msg) => {
        const eventId = msg.query

        const event = await db.getRepository(Event).createQueryBuilder('events')
            .where("events.id = :id", {id: eventId})
            .leftJoinAndSelect('events.location', 'location')
            .leftJoinAndSelect('location.preview', 'preview')
            .leftJoinAndSelect('events.participants', 'participants')
            .leftJoinAndSelect('participants.user', 'user')
            .leftJoinAndSelect('user.photo', 'photo')
            .leftJoinAndSelect('events.waitList', 'waitList')
            .leftJoinAndSelect('waitList.user', 'waitListUser')
            .getOne();

        console.log('HEREHQWEQ')


        if (!event) {
            throw new Error(`cannot find event with id: ${eventId}`)
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

        console.log(msg.data);

        let user = await db.getRepository(User).findOne({where: {username: msg.from.username}})

        if (!user) {
            user = new User()
            user.username = msg.from.username;
            await db.getRepository(User).save(user);
            user = await db.getRepository(User).findOne({where: {username: msg.from.username}})
        }

        if (!user) {
            throw new Error('user error')
        }

        // @ts-ignore
        const eventId = msg.data?.split("_")[1] ?? ""

        const event = await db.getRepository(Event).createQueryBuilder('events')
            .where("events.id = :id", {id: eventId})
            .leftJoinAndSelect('events.location', 'location')
            .leftJoinAndSelect('location.preview', 'preview')
            .leftJoinAndSelect('events.participants', 'participants')
            .leftJoinAndSelect('participants.user', 'user')
            .leftJoinAndSelect('events.waitList', 'waitList')
            .leftJoinAndSelect('waitList.user', 'waitListUser')
            .leftJoinAndSelect('user.photo', 'photo')
            .getOne();
        if (!event) {
            throw new Error(`cannot find event with id: ${eventId}`)
        }

        const userInParticipants = event.participants.find((participant: Participant) => participant.user.username === user!.username && !participant.waitList);
        const userInWaitList = event.participants.find((participant: Participant) => participant.user.username === user!.username && participant.waitList);

        if (msg.data?.startsWith("join")) {

            if (userInParticipants || userInWaitList) {
                throw `username: ${msg.from.username} already in participants`
            }

            const participant = new Participant()

            participant.event = event;
            participant.user = user;

            if (event.participantsLimit && event.participants.length >= event.participantsLimit) {
                participant.waitList = true;
            }

            await db.getRepository(Participant).save(participant);

        } else if (msg.data?.startsWith("leave")) {

            if (!userInParticipants && !userInWaitList) {
                throw new Error('user not participant');
            } else {
                const participantId = userInParticipants?.id ?? userInWaitList?.id;
                await db.getRepository(Participant).delete({id: participantId})

                if (!userInWaitList) {
                    const firstUserInWaitList = event.waitList.sort((a, b) => b.id - a.id)?.[0];
                    if (firstUserInWaitList) {
                        await db.getRepository(Participant).update({id: firstUserInWaitList.id}, {waitList: false})
                    }
                }
            }
        }

        const qweEvent = await db.getRepository(Event).createQueryBuilder('events')
            .where("events.id = :id", {id: eventId})
            .leftJoinAndSelect('events.location', 'location')
            .leftJoinAndSelect('location.preview', 'preview')
            .leftJoinAndSelect('events.participants', 'participants')
            .leftJoinAndSelect('participants.user', 'user')
            .leftJoinAndSelect('events.waitList', 'waitList')
            .leftJoinAndSelect('waitList.user', 'waitListUser')
            .leftJoinAndSelect('user.photo', 'photo')
            .getOne();

        if (!qweEvent) {
            throw new Error('qweqwe');
        }

        await bot.editMessageText(createEventMessage(qweEvent), {
            parse_mode: "HTML",
            disable_web_page_preview: true,
            inline_message_id: msg.inline_message_id,
            reply_markup: createQueryReplyMarkup(eventId),
        })
    }))


    // app.get("/events", (req, res) => {
    //     res.send(events)
    // })

    const expressAppPort = process.env.EXPRESS_APP_PORT!
    app.listen(expressAppPort, () => {
        console.log(chalk.bgBlue("EXPRESS STARTED"), chalk.blue(`port -> "${expressAppPort}"`))
    })

})();
