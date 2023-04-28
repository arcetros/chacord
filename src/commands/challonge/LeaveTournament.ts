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
    name = "leave";
    visible = true;
    description = "Leave a tournament";
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
        .addStringOption(option => option.setName("tournament_id").setDescription("Tournament ID").setRequired(true));
    execute = async (interaction: CommandInteraction): Promise<void> => {
        await interaction.deferReply();

        const tournament_id = interaction.options.get("tournament_id")?.value as string;
        const tournament = await this.challonge.tournament.show(tournament_id, true);

        // Map and extract the user ID inside bracket
        const currrentParticipants = tournament.participants.map(
            participant => participant.name.match(/^\[(.*?)\]\s*(.*)$/)[1]
        );

        if (!currrentParticipants.includes(interaction.user.id)) {
            interaction.editReply("You are not in the tournament");
            return;
        }

        const participantFullName = tournament.participants
            .map(participant => {
                return { id: participant.id, name: participant.name };
            })
            .find(i => i.name.includes(interaction.user.id));

        try {
            await this.challonge.participant.destroy(tournament_id, participantFullName?.id).then(() => {
                interaction.editReply(`<@${interaction.user.id}> left ${tournament.name}`);
            });
        } catch (err) {
            interaction.editReply({ content: `${err}` });
        }
    };
}
