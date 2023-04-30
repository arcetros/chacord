import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import Bot from "../../structures/Bot";
import Commands from "../../structures/Commands";

export default class BulkAddParticipants extends Commands {
    constructor(public client: Bot) {
        super(client);
    }
    name = "bulkaddp";
    visible = true;
    description = "Bulk add participants to a tournament (up until it is started).";
    information = this.description;
    aliases = [];
    args = false;
    usage = "";
    example = "";
    cooldown = 10;
    category = "challonge";
    guildOnly = false;
    data = new SlashCommandBuilder()
        .setName(this.name)
        .setDescription(this.description)
        .addStringOption(option =>
            option.setName("tournament_id").setDescription("Tournament ID (must be yours)").setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("participants")
                .setDescription("Format example: @john/3 (discord user, seed)")
                .setRequired(true)
        );
    execute = async (interaction: CommandInteraction): Promise<void> => {
        await interaction.deferReply();

        const { tournament_id, participants } = this.getCommandOptionValues(interaction, [
            "tournament_id",
            "participants"
        ]);

        try {
            await this.checkTournamentManager(interaction);
            const tournament = await this.challonge.tournament.show(tournament_id, true);
            this.checkOwner(interaction, tournament.description);

            const parseParticipants = await Promise.all(
                participants.split(",").map(async participant => {
                    const [name, seed] = participant.split("/");

                    const userId = await this.sanitizeUserId(name);

                    const guild = this.client.guilds.cache.get(interaction.guildId!);
                    const targetUser = await guild?.members.fetch(userId);

                    return {
                        name: `[${userId}] - ${targetUser?.user.username}`,
                        seed: seed ? Number(seed) : undefined
                    };
                })
            );

            await this.challonge.participant
                .bulkAdd(tournament_id, {
                    participants: parseParticipants
                })
                .then(() => {
                    interaction.editReply({
                        content: `${parseParticipants.length} participants added to ${tournament.name} tournament bracket`
                    });
                });
        } catch (err) {
            interaction.editReply({ content: `${err}` });
        }
    };
}
