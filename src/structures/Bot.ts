import {
    ApplicationCommandDataResolvable,
    Client,
    ClientOptions,
    Collection,
    // CommandInteraction,
    // Events,
    // Routes,
    Snowflake
} from "discord.js";
import { CommandsLoader } from "../utils/structures/CommandsLoader";
import { EventsLoader } from "../utils/structures/EventsLoader";

class Bot extends Client {
    public readonly commands = new CommandsLoader();
    public readonly events = new EventsLoader(this);
    public slashCommands = new Array<ApplicationCommandDataResolvable>();
    public cooldowns = new Collection<string, Collection<Snowflake, number>>();

    constructor(options: ClientOptions) {
        super(options);

        try {
            this.start();
        } catch (error) {
            console.error(error);
        }
    }

    private async start(): Promise<this> {
        await this.login(process.env.DISCORD_TOKEN);
        await Promise.all([this.commands.loadCommands("../../commands"), this.events.loadEvents("../../events")]);
        return this;
    }
}

export default Bot;
