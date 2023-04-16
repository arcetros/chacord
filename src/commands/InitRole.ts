import { CommandInteraction, SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import Bot from "../structures/Bot";
import Commands from "../structures/Commands";

const INIT_ROLE_NAME = "Tournament Manager";
const ROLE_COLOR = "#ed9645";

export default class InitRole extends Commands {
    constructor(public client: Bot) {
        super(client);
    }
    name = "initrole";
    visible = true;
    description = "Initialize tournament manager role";
    information = this.description;
    aliases = [];
    args = false;
    usage = "";
    example = "";
    cooldown = 10;
    category = "general";
    guildOnly = true;
    data = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
    execute = async (interaction: CommandInteraction): Promise<void> => {
        const guilds = this.client.guilds.cache;
        let roles: string[] = [];

        guilds.forEach(guild => {
            const guildRoles = guild.roles.cache.map(role => role.name);
            roles = roles.concat(guildRoles);
        });

        if (!roles.includes(INIT_ROLE_NAME)) {
            try {
                const role = await interaction.guild?.roles.create({
                    name: INIT_ROLE_NAME,
                    color: ROLE_COLOR,
                    reason: "The only role to manage tournaments beside admin permit"
                });
                interaction.reply({ content: `Successfully created ${role?.name} role` });
                return;
            } catch (err) {
                this.client.logger.error(err);
                interaction.reply({ content: `Error: ${err}` });
                return;
            }
        }

        await interaction.reply({ content: "Role is already initialized" });
    };
}
