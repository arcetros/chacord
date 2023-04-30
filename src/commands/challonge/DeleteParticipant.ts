import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import Bot from "../../structures/Bot";
import Commands from "../../structures/Commands";

export default class AddParticipant extends Commands {
    constructor(public client: Bot) {
        super(client);
    }
    name = "delp";
    visible = true;
    description = "Delete a participant from tournament";
    information = this.description;
    aliases = [];
    args = false;
    usage = "";
    example = "";
    cooldown = 0;
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
                .setName("participant_name")
                .setDescription("The name displayed in the bracket/schedule")
                .setRequired(true)
        );
    execute = async (interaction: CommandInteraction): Promise<void> => {
        await interaction.deferReply();

        const { tournament_id, participant_name } = this.getCommandOptionValues(interaction, [
            "tournament_id",
            "participant_name"
        ]);

        try {
            await this.checkTournamentManager(interaction);
            const tournament = await this.challonge.tournament.show(tournament_id, true);
            this.checkOwner(interaction, tournament.description);

            // Map and extract the user ID inside bracket
            const currrentParticipants = tournament.participants.map(
                participant => participant.name.match(/^\[(.*?)\]\s*(.*)$/)[1]
            );
            const userId = await this.sanitizeUserId(participant_name);

            if (!currrentParticipants.includes(userId)) {
                throw new Error(`<@${userId}> is not on the bracket`);
            }

            const participantFullName = tournament.participants
                .map(participant => {
                    return { id: participant.id, name: participant.name };
                })
                .find(i => i.name.includes(userId));

            await this.challonge.participant.destroy(tournament_id, `${participantFullName!.id}`).then(() => {
                interaction.editReply({
                    content: `<@${userId}> is deleted from ${tournament.name} tournament bracket`
                });
            });
        } catch (err) {
            interaction.editReply({ content: `${err}` });
        }
    };
}
