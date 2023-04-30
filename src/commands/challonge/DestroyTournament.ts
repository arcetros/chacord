import Commands from "../../structures/Commands";
import Bot from "../../structures/Bot";
import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";

export default class DestroyTournament extends Commands {
    constructor(public client: Bot) {
        super(client);
    }
    name = "tdestroy";
    visible = true;
    description = "Delete a tournament";
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
    execute = async (interaction: CommandInteraction<CacheType>): Promise<void> => {
        await interaction.deferReply();

        const { tournament_id } = this.getCommandOptionValues(interaction, ["tournament_id"]);
        try {
            await this.checkTournamentManager(interaction);
            const tournament = await this.challonge.tournament.show(tournament_id);
            this.checkOwner(interaction, tournament.description);

            const response = await this.challonge.tournament.destroy(tournament_id);
            interaction.editReply({ content: `${response.name} is successfully destroyed` });
        } catch (err) {
            interaction.editReply({ content: `${err}` });
        }
    };
}
