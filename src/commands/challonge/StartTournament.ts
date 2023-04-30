import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import Commands from "../../structures/Commands";
import Bot from "../../structures/Bot";

export default class StartTournament extends Commands {
    constructor(public client: Bot) {
        super(client);
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

        const { tournament_id } = this.getCommandOptionValues(interaction, ["tournament_id"]);

        try {
            const tournament = await this.challonge.tournament.show(tournament_id, true);
            this.checkOwner(interaction, tournament.description);

            const response = await this.challonge.tournament.start(tournament_id, true);

            if (response.state !== "pending") {
                throw new Error(`${tournament.name} has already started`);
            }

            const currrentParticipants = response.participants.map(
                participant => participant.name.match(/^\[(.*?)\]\s*(.*)$/)[1]
            );

            // DM every registered participants
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
