import { CacheType, CommandInteraction, Guild, Message, SlashCommandBuilder } from "discord.js";
import Bot from "./Bot";

export default abstract class Commands {
    client: Bot;
    private DISCORD_TAG_REGEX = /<@(\d+)>/;
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
            return interaction.editReply({ content: "Tournament Manager role not found, run /initrole first" });
        }

        if (member?.permissions.has("Administrator")) return true;
        if (member?.roles.cache.has(tournamentRole.id)) {
            return true;
        }
        return false;
    }

    public sanitizeUserId(
        user: string,
        interaction: CommandInteraction<CacheType>
    ): string | Promise<Message<boolean>> {
        const match = this.DISCORD_TAG_REGEX.exec(user);
        if (!match) {
            return interaction.editReply({ content: "User is not valid, make sure to tag them directly" });
        }
        return match[1];
    }
}
