import { CommandInteraction, SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import Bot from "../structures/Bot";
import Commands from "../structures/Commands";

const DISCORD_TAG_REGEX = /<@(\d+)>/;

export default class InitRole extends Commands {
    constructor(public client: Bot) {
        super(client);
    }
    name = "trole";
    visible = true;
    description = "Grant another user Tournament Manager role";
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
        .addStringOption(option => option.setName("user").setDescription("Target user").setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
    execute = async (interaction: CommandInteraction): Promise<void> => {
        const guild = this.client.guilds.cache.get(interaction.guildId!);
        const tournamentRole = this.getTournamentManagerRole(guild);

        if (!tournamentRole) {
            interaction.reply({ content: "Tournament Manager role not found, run /initrole first" });
            return;
        }

        const userId = interaction.options.get("user")?.value as string;
        const match = DISCORD_TAG_REGEX.exec(userId);

        if (!match) {
            interaction.reply({ content: "User is not valid, make sure to tag them  directly" });
            return;
        }

        const targetMember = await guild?.members.fetch(match[1]);

        if (!targetMember) {
            interaction.reply({ content: "User not found" });
            return;
        }

        if (await this.isTournamentManager(interaction, targetMember.user.id)) {
            interaction.reply({ content: `<@${targetMember.user.id}> is already have Tournament Manager role` });
            return;
        }

        targetMember?.roles
            .add(tournamentRole.id)
            .then(() =>
                interaction.reply({ content: `<@${targetMember.user.id}> is granted Tournament Manager role` })
            );
    };
}
