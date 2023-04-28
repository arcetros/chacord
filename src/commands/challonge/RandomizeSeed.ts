import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import Challonge from "../../api/Client";
import Commands from "../../structures/Commands";
import Bot from "../../structures/Bot";

export default class StartTournament extends Commands {
    public challonge: Challonge;
    constructor(public client: Bot) {
        super(client);
        this.challonge = new Challonge({ api_key: process.env.CHALLONGE_API_KEY as string });
    }
    name = "randomseed";
    visible = true;
    description = "Randomize seeds among participants. Only applicable before a tournament has started.";
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

        const tournament_id = interaction.options.get("tournament_id")?.value as string;
        const tournament = await this.challonge.tournament.show(tournament_id, true);

        if (!(await this.isTournamentManager(interaction))) {
            interaction.editReply({ content: "Insufficient permission" });
            return;
        }

        if (tournament.description.split(",")[0] !== interaction.user.id) {
            interaction.editReply({
                content: "Cant randomize participants seed, you are not the owner of this tournament"
            });
            return;
        }

        try {
            await this.challonge.participant.randomize(tournament_id).then(() => {
                return interaction.editReply({
                    content: `Successfully randomized ${tournament.participants.length} participants`
                });
            });
        } catch (err) {
            interaction.editReply({ content: `${err}` });
        }
    };
}
