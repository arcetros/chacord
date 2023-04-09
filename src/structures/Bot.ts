import {
    ApplicationCommandDataResolvable,
    Client,
    ClientOptions,
    Collection,
    CommandInteraction,
    Events,
    REST,
    Routes,
    Snowflake
} from "discord.js";
import { readdirSync } from "fs";
import { join } from "path";
import { Command } from "../typings";

class Bot extends Client {
    public slashCommands = new Array<ApplicationCommandDataResolvable>();
    public slashCommandsMap = new Collection<string, Command>();
    public cooldowns = new Collection<string, Collection<Snowflake, number>>();
    public rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN!);

    constructor(options: ClientOptions) {
        super(options);

        try {
            this.start();
        } catch (error) {
            console.error(error);
        }

        this.on(Events.ClientReady, client => {
            console.log(`Ready logged in as ${client.user.tag}`);
            (async () => {
                const commandsFiles = readdirSync(join(__dirname, "../commands"));
                for (const file of commandsFiles) {
                    const command = await import(join(__dirname, "../commands", `${file}`));
                    this.slashCommands.push(command.default.data);
                    this.slashCommandsMap.set(command.default.data.name, command.default);
                }
                await this.rest.put(Routes.applicationCommands(client.user!.id), { body: this.slashCommands });
            })();
        });

        this.on(Events.InteractionCreate, async (interaction): Promise<any> => {
            if (!interaction.isChatInputCommand) return;
            if (interaction instanceof CommandInteraction) {
                const command = this.slashCommandsMap.get(interaction.commandName);
                if (!command) return;
                if (!this.cooldowns.has(interaction.commandName)) {
                    this.cooldowns.set(interaction.commandName, new Collection());
                }
                const now = Date.now();
                const timestamps: any = this.cooldowns.get(interaction.commandName);
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
    }

    async start() {
        await this.login(process.env.DISCORD_TOKEN);
    }
}

export default Bot;
