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
import { MainRouter } from "./routers";
import { t, tKeys } from "./tKeys";
import db from "./database";
import dotenv from "dotenv";
import chalk from "chalk";
import cors from "cors";
import path from "path";
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

  botEventsInit();

  const expressAppPort = process.env.EXPRESS_APP_PORT!;
  app.listen(expressAppPort, () => {
    console.log(
      chalk.bgBlue("EXPRESS STARTED"),
      chalk.blue(`port -> "${expressAppPort}"`),
    );
  });
})();
