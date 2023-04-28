import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import Challonge from "../../api/Client";
import Bot from "../../structures/Bot";
import Commands from "../../structures/Commands";

export default class AddParticipant extends Commands {
    public challonge: Challonge;
    constructor(public client: Bot) {
        super(client);
        this.challonge = new Challonge({ api_key: process.env.CHALLONGE_API_KEY as string });
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

        const tournament_id = interaction.options.get("tournament_id")?.value as string;
        const participantName = interaction.options.get("participant_name")?.value as string;

        const tournament = await this.challonge.tournament.show(tournament_id, true);

        // Map and extract the user ID inside bracket
        const currrentParticipants = tournament.participants.map(
            participant => participant.name.match(/^\[(.*?)\]\s*(.*)$/)[1]
        );

        if (!(await this.isTournamentManager(interaction))) {
            interaction.editReply({ content: "Insufficient permission" });
            return;
        }

        if (tournament.description.split(",")[0] !== interaction.user.id) {
            interaction.editReply({ content: "Cant delete participant, you are not the owner of this tournament" });
            return;
        }

        const userId = await this.sanitizeUserId(participantName, interaction);
        if (typeof userId === "object") {
            return;
        }

        if (!currrentParticipants.includes(userId)) {
            interaction.editReply({ content: `<@${userId}> is not on the bracket` });
            return;
        }

        const participantFullName = tournament.participants
            .map(participant => {
                return { id: participant.id, name: participant.name };
            })
            .find(i => i.name.includes(userId));

        try {
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
