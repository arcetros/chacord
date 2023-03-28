import * as dotenv from "dotenv";
import {
    Client,
    Events,
    GatewayIntentBits,
    REST,
    Collection,
    ApplicationCommandDataResolvable,
    Routes,
    CommandInteraction,
    Snowflake
} from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { Command } from "./typings";

// Initialize environment variables
dotenv.config();

const DISCORD_TOKEN = process.env.DISCORD_TOKEN as string;

// Initialize rest
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

const rest = new REST({ version: "9" }).setToken(DISCORD_TOKEN);

const slashCommands = new Array<ApplicationCommandDataResolvable>();
const slashCommandsMap = new Collection<string, Command>();
const cooldowns = new Collection<string, Collection<Snowflake, number>>();

client.on(Events.ClientReady, c => {
    console.log(`Ready! logged in as ${c.user.tag}`);
    (async () => {
        const commandsFiles = readdirSync(join(__dirname, "commands"));
        for (const file of commandsFiles) {
            const command = await import(join(__dirname, "commands", `${file}`));
            slashCommands.push(command.default.data);
            slashCommandsMap.set(command.default.data.name, command.default);
        }
        await rest.put(Routes.applicationCommands(client.user!.id), { body: slashCommands });
    })();
});

client.on(Events.InteractionCreate, async (interaction): Promise<any> => {
    if (!interaction.isChatInputCommand) return;
    if (interaction instanceof CommandInteraction) {
        const command = slashCommandsMap.get(interaction.commandName);
        if (!command) return;
        if (!cooldowns.has(interaction.commandName)) {
            cooldowns.set(interaction.commandName, new Collection());
        }
        const now = Date.now();
        const timestamps: any = cooldowns.get(interaction.commandName);
        const cooldownAmount = (command.cooldown || 1) * 1000;
        if (timestamps.has(interaction.user.id)) {
            const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
            if (now < expirationTime) {
                const timeLeft = (expirationTime - now) / 1000;
                return interaction.reply({
                    content: `Please wait ${timeLeft.toFixed(1)} more second(s) before using the ${
                        interaction.commandName
                    }`
                });
            }
        }
        timestamps.set(interaction.user.id, now);
        setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
        command.execute(interaction);
    }
});

client.login(DISCORD_TOKEN);
