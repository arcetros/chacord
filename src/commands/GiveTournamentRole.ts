import { CommandInteraction, SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import Bot from "../structures/Bot";
import Commands from "../structures/Commands";

export default class GiveTournamentRole extends Commands {
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
    cooldown = 0;
    category = "general";
    guildOnly = true;
    data = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption(option => option.setName("user").setDescription("Target user").setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
    execute = async (interaction: CommandInteraction): Promise<void> => {
        await interaction.deferReply();

        const { user: userId } = this.getCommandOptionValues(interaction, ["user"]);

        try {
            const guild = this.client.guilds.cache.get(interaction.guildId!);
            const tournamentRole = this.getTournamentManagerRole(guild);

            if (!tournamentRole) {
                throw new Error("Something went wrong try re-run the bots");
            }

            const newUserId = await this.sanitizeUserId(userId);

            const targetMember = await guild?.members.fetch(newUserId);

            if (!targetMember) {
                interaction.editReply({ content: "User not found" });
                return;
            }

            if (await this.isTournamentManager(interaction, targetMember.user.id)) {
                if (!targetMember.permissions.has("Administrator")) {
                    throw new Error(`<@${targetMember.user.id}> is already have Tournament Manager role`);
                }
            }

            targetMember?.roles
                .add(tournamentRole.id)
                .then(() =>
                    interaction.editReply({ content: `<@${targetMember.user.id}> is granted Tournament Manager role` })
                );
        } catch (err) {
            interaction.editReply({ content: `${err}` });
        }
    };
}
