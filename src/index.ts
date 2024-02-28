import "express-async-errors";
import express, { NextFunction, Request, Response } from "express";
import { Participant } from "./database/entities/Participant";
import { createEventMessage } from "./tg_bot/bot_utils/createEventMessage";
import { Location } from "./database/entities/Location";
import swaggerDocument from "../public/swagger.json";
import { registerBotEventHandler } from "./tg_bot/bot_utils/logger";
import { Event } from "./database/entities/Event";
import { User } from "./database/entities/User";
import TelegramBot from "node-telegram-bot-api";
import { assertIsRawEvent } from "./tg_bot/bot_utils/typeGuards";
import swaggerUi from "swagger-ui-express";
import { MainRouter } from "./routers";
import db from "./database";
import dotenv from "dotenv";
import chalk from "chalk";
import cors from "cors";
import { botEventsInit } from "./tg_bot";

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
  if (err.message) {
    res.status(400).send({ error: err.message });
  }
  res.status(500).send({ error: "something went wrong" });
  next(err);
};

if (process.env.NODE_ENV === "dev") {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

app.use("/api", MainRouter);
app.use(errorHandler);

(async function () {
  await db.initialize();
  botEventsInit();

  const expressAppPort = process.env.EXPRESS_APP_PORT!;
  app.listen(expressAppPort, () => {
    console.log(
      chalk.bgBlue("EXPRESS STARTED"),
      chalk.blue(`port -> "${expressAppPort}"`),
    );
  });
})();
