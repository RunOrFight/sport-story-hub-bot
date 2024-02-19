import "express-async-errors";
import express, { NextFunction, Request, Response } from "express";
import { Participant } from "./database/entities/Participant";
import { createEventMessage } from "./createEventMessage";
import { Location } from "./database/entities/Location";
import swaggerDocument from "../public/swagger.json";
import { registerBotEventHandler } from "./logger";
import { Event } from "./database/entities/Event";
import { User } from "./database/entities/User";
import TelegramBot from "node-telegram-bot-api";
import { assertIsRawEvent } from "./typeGuards";
import swaggerUi from "swagger-ui-express";
import { FindOneOptions } from "typeorm";
import { MainRouter } from "./routers";
import { t, tKeys } from "./tKeys";
import db from "./database";
import dotenv from "dotenv";
import chalk from "chalk";
import cors from "cors";
import path from "path";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(err);
  res.status(500).send({ errors: [{ message: "Something went wrong" }] });
  next(err);
};

if (process.env.NODE_ENV === "dev") {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use("/api", MainRouter);
app.use(errorHandler);

(async function () {
  await db.initialize();

  app.get("/api", (_req, res) => {
    const path = `/api/events`;
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Cache-Control", "s-max-age=1, stale-while-revalidate");
    res.end(`Hello! Go to events: <a href="${path}">${path}</a>`);
  });

  app.get("/api/events", (_req, res) => {
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.json({ name: "John Doe" });
  });

  app.get("/api/locations", async (_req, res) => {
    const locations = await db
      .getRepository(Location)
      .createQueryBuilder("locations")
      .leftJoinAndSelect("locations.preview", "locationPreview")
      .getMany();

    res.statusCode = 200;
    res.send(locations);
  });

  app.get("/api/images/:imageName", (req, res) => {
    const imagesFolder = path.join(__dirname, "images");
    const imageName = req.params.imageName;
    const imagePath = path.join(imagesFolder, imageName);

    // Отправляем изображение в ответе
    res.sendFile(imagePath, {}, (err) => {
      if (err) {
        console.error(err);
        res.status(404).send("Not Found");
      }
    });
  });

  const bot = new TelegramBot(process.env.TELEGRAM_BOT_ACCESS_TOKEN!, {
    polling: true,
  });
  console.log(chalk.bgCyan("TELEGRAM BOT CREATED"));

  bot.on(
    ...registerBotEventHandler("message", async (msg) => {
      const chatId = msg.chat.id;

      if (msg.web_app_data?.data) {
        return;
      }

      await bot.sendMessage(chatId, t(tKeys.useButtonsHint), {
        reply_markup: {
          keyboard: [
            [
              {
                text: t(tKeys.webAppButton),
                web_app: { url: process.env.WEB_APP_URL! },
              },
            ],
          ],
        },
      });
    }),
  );

  bot.on(
    ...registerBotEventHandler("web_app_data", async (msg) => {
      const dataString = msg.web_app_data?.data;

      if (!dataString) {
        throw "dataString is not received";
      }

      const parsedData = assertIsRawEvent(JSON.parse(dataString));
      const locationRepository = db.getRepository(Location);
      // TODO: edit 1 to parsedData.locationId
      const location = await locationRepository.findOne({ where: { id: 1 } });

      if (!location) {
        throw "No location";
      }

      const newEvent = new Event();

      newEvent.location = location;
      newEvent.dateTime = new Date(parsedData.dateTime);
      newEvent.price = parsedData.price;
      newEvent.participantsLimit = parsedData.participantsLimit;
      newEvent.description = parsedData.description;
      await db.getRepository(Event).save(newEvent);

      const event = await db
        .getRepository(Event)
        .createQueryBuilder("events")
        .where("events.id = :id", { id: newEvent.id })
        .leftJoinAndSelect("events.location", "location")
        .leftJoinAndSelect("location.preview", "preview")
        .leftJoinAndSelect("events.participants", "participants")
        .leftJoinAndSelect("participants.user", "user")
        .leftJoinAndSelect("user.photo", "photo")
        .getOne();

      if (!event) {
        throw new Error("eroeroe");
      }

      await bot.sendMessage(msg.chat.id, createEventMessage(event), {
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [
            [
              {
                switch_inline_query: event.id.toString(),
                text: t(tKeys.botMessageShare),
              },
            ],
          ],
        },
      });
    }),
  );

  const createQueryReplyMarkup = (eventId: string) => ({
    inline_keyboard: [
      [
        { text: t(tKeys.eventMessageJoin), callback_data: `join_${eventId}` },
        {
          text: t(tKeys.eventMessageLeave),
          callback_data: `leave_${eventId}`,
        },
      ],
    ],
  });

  bot.on(
    ...registerBotEventHandler("inline_query", async (msg) => {
      const eventId = msg.query;

      const event = await db
        .getRepository(Event)
        .createQueryBuilder("events")
        .where("events.id = :id", { id: eventId })
        .leftJoinAndSelect("events.location", "location")
        .leftJoinAndSelect("location.preview", "preview")
        .leftJoinAndSelect("events.participants", "participants")
        .leftJoinAndSelect("participants.user", "user")
        .leftJoinAndSelect("user.photo", "photo")
        .getOne();

      if (!event) {
        throw new Error(`cannot find event with id: ${eventId}`);
      }

      await bot.answerInlineQuery(msg.id, [
        {
          title: "Event",
          id: event.id.toString(),
          type: "article",
          input_message_content: {
            parse_mode: "HTML",
            disable_web_page_preview: true,
            message_text: createEventMessage(event),
          },
          reply_markup: createQueryReplyMarkup(event.id.toString()),
        },
      ]);
    }),
  );

  bot.on(
    ...registerBotEventHandler("callback_query", async (msg) => {
      try {
        if (!msg.from.username) {
          throw "message without username received";
        }

        let user = await db
          .getRepository(User)
          .findOne({ where: { username: msg.from.username } });

        if (!user) {
          user = new User();
          user.username = msg.from.username;
          await db.getRepository(User).save(user);
          user = await db
            .getRepository(User)
            .findOne({ where: { username: msg.from.username } });
        }

        if (!user) {
          throw new Error("user error");
        }

        // @ts-ignore
        const eventId = msg.data?.split("_")[1] ?? "";

        const event = await db
          .getRepository(Event)
          .createQueryBuilder("events")
          .where("events.id = :id", { id: eventId })
          .leftJoinAndSelect("events.location", "location")
          .leftJoinAndSelect("location.preview", "preview")
          .leftJoinAndSelect("events.participants", "participants")
          .leftJoinAndSelect("participants.user", "user")
          .leftJoinAndSelect("user.photo", "photo")
          .leftJoinAndSelect(
            "participants.parentParticipant",
            "parentParticipant",
          )
          .leftJoinAndSelect("parentParticipant.user", "parentParticipantUser")
          .getOne();
        if (!event) {
          throw new Error(`cannot find event with id: ${eventId}`);
        }

        const userInParticipants = event.participants.find(
          (participant: Participant) =>
            participant.user.username === user!.username &&
            !participant.waitList,
        );
        const userInWaitList = event.participants.find(
          (participant: Participant) =>
            participant.user.username === user!.username &&
            participant.waitList,
        );

        if (msg.data?.startsWith("join")) {
          const participant = new Participant();
          participant.event = event;

          if (userInParticipants || userInWaitList) {
            const unknownPlayer = await db
              .getRepository(User)
              .findOne({ where: { username: "player" } });
            participant.user = unknownPlayer!;
            participant.parentParticipant =
              userInParticipants ?? userInWaitList;
          } else {
            participant.user = user;
          }

          if (
            event.participantsLimit &&
            event.participants.length >= event.participantsLimit
          ) {
            participant.waitList = true;
          }

          await db.getRepository(Participant).save(participant);
        } else if (msg.data?.startsWith("leave")) {
          if (!userInParticipants && !userInWaitList) {
            throw new Error("user not participant");
          } else {
            console.log(userInParticipants);
            const childParticipant = await db
              .getRepository(Participant)
              .findOne({
                where: { parentParticipant: userInParticipants },
              } as FindOneOptions<Participant>);
            console.log(childParticipant);
            const participantId =
              childParticipant?.id ??
              userInParticipants?.id ??
              userInWaitList?.id;
            await db.getRepository(Participant).delete({ id: participantId });
            const participantsInWaitList = await db
              .getRepository(Participant)
              .find({
                where: { waitList: true },
                order: { id: "ASC" },
              });

            if (!userInWaitList) {
              const firstUserInWaitList = participantsInWaitList[0];
              if (firstUserInWaitList) {
                await db
                  .getRepository(Participant)
                  .update({ id: firstUserInWaitList.id }, { waitList: false });
              }
            }
          }
        }

        const qweEvent = await db
          .getRepository(Event)
          .createQueryBuilder("events")
          .where("events.id = :id", { id: eventId })
          .leftJoinAndSelect("events.location", "location")
          .leftJoinAndSelect("location.preview", "preview")
          .leftJoinAndSelect("events.participants", "participants")
          .leftJoinAndSelect("participants.user", "user")
          .leftJoinAndSelect("user.photo", "photo")
          .leftJoinAndSelect(
            "participants.parentParticipant",
            "parentParticipant",
          )
          .leftJoinAndSelect("parentParticipant.user", "parentParticipantUser")
          .getOne();

        if (!qweEvent) {
          throw new Error("qweqwe");
        }

        await bot.editMessageText(createEventMessage(qweEvent), {
          parse_mode: "HTML",
          disable_web_page_preview: true,
          inline_message_id: msg.inline_message_id,
          reply_markup: createQueryReplyMarkup(eventId),
        });
      } catch (err) {
        console.error(err);
        throw err;
      }
    }),
  );

  // app.get("/events", (req, res) => {
  //     res.send(events)
  // })

  const expressAppPort = process.env.EXPRESS_APP_PORT!;
  app.listen(expressAppPort, () => {
    console.log(
      chalk.bgBlue("EXPRESS STARTED"),
      chalk.blue(`port -> "${expressAppPort}"`),
    );
  });
})();
