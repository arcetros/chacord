import { REST, Routes } from "discord.js";
import Bot from "../structures/Bot";
import Events from "../structures/Events";

export default class Ready extends Events {
    constructor(client: Bot) {
        super(client, "ready", true);
    }

    public runOnce = true;
    public async run(client: Bot): Promise<void> {
        const rest = new REST({ version: "9" }).setToken(process.env.DISCORD_TOKEN!);
        client.commands.forEach(command => {
            client.slashCommands.push(command.data.toJSON());
        });
        await rest.put(Routes.applicationCommands(client.user!.id), {
            body: client.slashCommands
        });

        console.log("Logged in as " + client.user?.tag);
    }
}
