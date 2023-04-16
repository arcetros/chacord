import { CommandInteraction, InteractionResponse, SlashCommandBuilder } from "discord.js";
import Bot from "./Bot";

export default abstract class Commands {
    client: Bot;
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

    public async isTournamentManager(interaction: CommandInteraction): Promise<boolean | InteractionResponse<boolean>> {
        const guild = this.client.guilds.cache.get(interaction.guildId!);
        const member = await guild?.members.fetch(interaction.user.id);

        const getTournamentManagerRole = guild?.roles.cache
            .map(role => {
                return { id: role.id, name: role.name };
            })
            .find(role => role.name === "Tournament Manager");

        if (!getTournamentManagerRole) {
            return interaction.reply({ content: "Tournament Manager role not found, run /initrole first" });
        }

        if (member?.permissions.has("Administrator")) return true;
        if (member?.roles.cache.has(getTournamentManagerRole.id)) {
            return true;
        }
        return false;
    }
}
