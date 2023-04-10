import { GatewayIntentBits } from "discord.js";
import "dotenv/config";
import Bot from "./structures/Bot";
import { NoStackError } from "./utils/structures/NoStackError";

const client = new Bot({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

process
    .on("exit", code => client.logger.info(`NodeJS process exited with code ${code}`))
    .on("unhandledRejection", reason =>
        client.logger.error(
            "UNHANDLED_REJECTION:",
            (reason as Error).stack ? reason : new NoStackError(reason as string)
        )
    )
    .on("warning", (...args) => client.logger.warn(...args))
    .on("uncaughtException", err => {
        client.logger.error("UNCAUGHT_EXCEPTION:", err);
        client.logger.warn("Uncaught Exception detected, trying to restart...");
        process.exit(1);
    });

client.start().catch(e => client.logger.error("PROMISE_ERR:", e));
