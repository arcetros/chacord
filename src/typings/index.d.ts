import { SlashCommandBuilder } from "discord.js";

export interface Command {
    permissions?: string[];
    cooldown?: number;
    data: SlashCommandBuilder;
    execute(...args: any): any;
}

export interface RequestBuilder {
    api_key: string;
    subDomain?: string;
    format?: string;
    timeout?: number;
    messageProperties?: boolean;
}
