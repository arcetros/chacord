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
    name = "start";
    visible = true;
    description = "Start a tournament";
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

        if (tournament.description !== interaction.user.id) {
            interaction.editReply({ content: "Cant start tournament, you are not the owner of this tournament" });
            return;
        }

        try {
            const response = await this.challonge.tournament.start(tournament_id, true);

            if (response.state !== "pending") {
                interaction.editReply({ content: `${tournament.name} has already started` });
                return;
            }

            const currrentParticipants = response.participants.map(
                participant => participant.name.match(/^\[(.*?)\]\s*(.*)$/)[1]
            );

            for (const participant of currrentParticipants) {
                this.client.users.cache
                    .get(participant)
                    ?.send(`${tournament.name} is starting right now, Make sure to join as soon as possible`);
            }

            interaction.editReply({ content: `${tournament.name} is starting right now!` });
        } catch (err) {
            interaction.editReply({ content: `${err}` });
        }
    };
}
