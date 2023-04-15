import { CommandInteraction, SlashCommandBuilder } from "discord.js";
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
}
