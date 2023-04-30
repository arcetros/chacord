import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import Commands from "../../structures/Commands";
import Bot from "../../structures/Bot";

export default class StartTournament extends Commands {
    constructor(public client: Bot) {
        super(client);
    }
    name = "clearp";
    visible = true;
    description = "Deletes all participants in a tournament. (Only allowed if tournament hasn't started yet)";
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
            option
                .setName("tournament_id")
                .setDescription("The ID of the tournament to process the action")
                .setRequired(true)
        );
    execute = async (interaction: CommandInteraction): Promise<void> => {
        await interaction.deferReply();
        const { tournament_id } = this.getCommandOptionValues(interaction, ["tournament_id"]);

        try {
            await this.checkTournamentManager(interaction);
            const tournament = await this.challonge.tournament.show(tournament_id, true);
            this.checkOwner(interaction, tournament.description);

            await this.challonge.participant.clear(tournament_id).then(() => {
                return interaction.editReply({
                    content: `Successfully cleared ${tournament.participants.length} participants`
                });
            });
        } catch (err) {
            interaction.editReply({ content: `${err}` });
        }
    };
}
