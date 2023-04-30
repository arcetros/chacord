import { CacheType, CommandInteraction, Guild, Message, SlashCommandBuilder } from "discord.js";
import Bot from "./Bot";
import Challonge from "../api/Client";

export default abstract class Commands {
    private DISCORD_TAG_REGEX = /<@(\d+)>/;
    public client: Bot;
    public challonge: Challonge;
    abstract name: string;
    abstract visible: boolean;
    abstract description: string;
    abstract information: string;
    abstract aliases: string[];
    abstract args: boolean;
    abstract usage: string;
    abstract example: string;
    abstract cooldown: number;
    abstract category: string;
    abstract guildOnly: boolean;
    abstract data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    abstract execute: (interaction: CommandInteraction) => Promise<void>;

    public constructor(client: Bot) {
        this.client = client;
        this.challonge = new Challonge({ api_key: process.env.CHALLONGE_API_KEY as string });
    }

    public getTournamentManagerRole(guild: Guild | undefined):
        | {
              id: string;
              name: string;
          }
        | undefined {
        const role = guild?.roles.cache
            .map(role => {
                return { id: role.id, name: role.name };
            })
            .find(role => role.name === "Tournament Manager");

        if (!role) return undefined;
        return role;
    }

    public async isTournamentManager(
        interaction: CommandInteraction,
        userId?: string
    ): Promise<boolean | Message<boolean>> {
        const guild = this.client.guilds.cache.get(interaction.guildId!);

        // Will get provided userId first if exist, otherwise it will uses user id that are using the interaction command
        const member = await guild?.members.fetch(userId || interaction.user.id);
        const tournamentRole = this.getTournamentManagerRole(guild);

        if (!tournamentRole) {
            throw new Error("Something went wrong, try re-running the bot");
        }

        if (member?.permissions.has("Administrator")) return true;
        if (member?.roles.cache.has(tournamentRole.id)) {
            return true;
        }
        return false;
    }

    public async checkTournamentManager(interaction: CommandInteraction<CacheType>): Promise<void> {
        if (!(await this.isTournamentManager(interaction))) {
            throw new Error("You need Tournament Manager role to use this command");
        }
    }

    public checkOwner(interaction: CommandInteraction<CacheType>, description: string) {
        if (description && description.split(",")[0] !== interaction.user.id) {
            throw new Error("You are not the owner of this tournament");
        }
    }

    public sanitizeUserId(user: string): string | Promise<Message<boolean>> {
        const match = this.DISCORD_TAG_REGEX.exec(user);
        if (!match) {
            throw new Error("User is not valid, make sure to tag them directly");
        }
        return match[1];
    }

    public getCommandOptionValues<T extends string>(interaction: CommandInteraction, options: T[]): Record<T, string> {
        const values: Record<T, string> = {} as Record<T, string>;

        options.forEach(option => {
            const value = interaction.options.get(option)?.value as string;
            if (value) {
                values[option] = value;
            } else {
                values[option] = "";
            }
        });
        return values;
    }
}
