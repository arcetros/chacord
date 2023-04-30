import { REST, Routes } from "discord.js";
import Bot from "../structures/Bot";
import Events from "../structures/Events";

const INIT_ROLE_NAME = "Tournament Manager";
const ROLE_COLOR = "#ed9645";
export default class Ready extends Events {
    constructor(client: Bot) {
        super(client, "ready", true);
    }

    public async run(client: Bot): Promise<void> {
        const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN!);
        client.commands.forEach(command => {
            client.slashCommands.push(command.data.toJSON());
        });
        await rest.put(Routes.applicationCommands(client.user!.id), {
            body: client.slashCommands
        });

        const guildIds = client.guilds.cache.map(item => item.id);
        for (const id of guildIds) {
            const guild = client.guilds.cache.get(id);
            if (!guild) continue;
            const guildRoles = guild.roles.cache.map(item => item.name);

            if (!guildRoles.includes(INIT_ROLE_NAME)) {
                try {
                    const role = await guild?.roles.create({
                        name: INIT_ROLE_NAME,
                        color: ROLE_COLOR,
                        reason: "The only role to manage tournaments beside admin permit"
                    });
                    client.logger.success(`Success created ${role.name} role in ${guild.name}`);
                } catch (err) {
                    client.logger.error(err);
                }
            }
        }
        client.logger.info("Logged in as " + client.user?.tag);
    }
}
