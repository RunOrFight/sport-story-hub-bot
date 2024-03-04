import TelegramBot from "node-telegram-bot-api";
import chalk from "chalk";
import { registerBotEventHandler } from "./bot_utils/logger";
import { t, tKeys } from "./bot_utils/tKeys";
import { assertIsRawEvent } from "./bot_utils/typeGuards";
import { createEventMessage } from "./bot_utils/createEventMessage";
import { EventService } from "../services/event.service";
import { UserService } from "../services/user.service";
import { webappRoutes } from "../constants/webappRoutes";

const userService = new UserService();
const eventService = new EventService();

export const bot = new TelegramBot(process.env.TELEGRAM_BOT_ACCESS_TOKEN!, {
  polling: true,
});

export const botEventsInit = () => {
  console.log(chalk.bgCyan("TELEGRAM BOT CREATED SUCCESSFULLY"));

  // message handler
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
                text: t(tKeys.webAppCreateEventButton),
                web_app: {
                  url: new URL(
                    webappRoutes.createEventRoute,
                    process.env.WEB_APP_URL!,
                  ).toString(),
                },
              },
              {
                text: t(tKeys.webAppManageLocationsButton),
                web_app: {
                  url: new URL(
                    webappRoutes.locationsRoute,
                    process.env.WEB_APP_URL!,
                  ).toString(),
                },
              },
            ],
          ],
        },
      });
    }),
  );

  // web app data handler
  bot.on(
    ...registerBotEventHandler("web_app_data", async (msg) => {
      const dataString = msg.web_app_data?.data;

      if (!dataString) {
        throw "dataString is not received";
      }

      const parsedData = assertIsRawEvent(JSON.parse(dataString));
      const newEvent = await eventService.createEvent(parsedData);
      const eventForMessage = await eventService.getEventForTgBotMessage(
        newEvent.id,
      );

      await bot.sendMessage(msg.chat.id, createEventMessage(eventForMessage), {
        parse_mode: "HTML",
        disable_web_page_preview: true,
        reply_markup: {
          inline_keyboard: [
            [
              {
                switch_inline_query: eventForMessage.id.toString(),
                text: t(tKeys.botMessageShare),
              },
            ],
          ],
        },
      });
    }),
  );

  // inline query handler
  bot.on(
    ...registerBotEventHandler("inline_query", async (msg) => {
      const eventId = msg.query;
      if (!eventId || isNaN(Number(eventId))) {
        throw new Error(`No event id in message`);
      }

      const eventForMessage = await eventService.getEventForTgBotMessage(
        Number(eventId),
      );

      await bot.answerInlineQuery(msg.id, [
        {
          title: "Event",
          id: eventId,
          type: "article",
          input_message_content: {
            parse_mode: "HTML",
            disable_web_page_preview: true,
            message_text: createEventMessage(eventForMessage),
          },
          reply_markup: createQueryReplyMarkup(eventId),
        },
      ]);
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

  // callback query handler
  bot.on(
    ...registerBotEventHandler("callback_query", async (msg) => {
      if (!msg.from?.username) {
        throw new Error("Message without username received");
      }

      const username = msg.from.username;

      const { user } = await userService.userInit({
        username,
      });

      if (!msg.data) {
        throw new Error("No message data");
      }

      const eventId = Number(msg.data.split("_")[1]);

      if (isNaN(eventId)) {
        throw new Error("Incorrect message data, cannot split");
      }

      if (msg.data?.startsWith("join")) {
        await eventService.joinEvent({ eventId, username });
      } else if (msg.data?.startsWith("leave")) {
        await eventService.leaveEvent({ eventId, username });
      }

      const eventForMessage =
        await eventService.getEventForTgBotMessage(eventId);

      await bot.editMessageText(createEventMessage(eventForMessage), {
        parse_mode: "HTML",
        disable_web_page_preview: true,
        inline_message_id: msg.inline_message_id,
        reply_markup: createQueryReplyMarkup(String(eventId)),
      });
    }),
  );
};
