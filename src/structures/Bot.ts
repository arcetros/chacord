import consola from "consola";
import { ApplicationCommandDataResolvable, Client, ClientOptions, Collection, Snowflake } from "discord.js";
import { CommandsLoader } from "../utils/structures/CommandsLoader";
import { EventsLoader } from "../utils/structures/EventsLoader";

class Bot extends Client {
    public readonly logger = consola;
    public readonly commands = new CommandsLoader(this);
    public readonly events = new EventsLoader(this);
    public slashCommands = new Array<ApplicationCommandDataResolvable>();
    public cooldowns = new Collection<string, Collection<Snowflake, number>>();

    constructor(options: ClientOptions) {
        super(options);
    }

    public async start(): Promise<void> {
        await Promise.all([this.commands.loadCommands("../../commands"), this.events.loadEvents("../../events")]);
        await this.login(process.env.DISCORD_TOKEN);
    }
}

export default Bot;
