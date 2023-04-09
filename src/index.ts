import { GatewayIntentBits } from "discord.js";
import "dotenv/config";
import Bot from "./structures/Bot";

export default new Bot({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});
