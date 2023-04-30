import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import Bot from "../../structures/Bot";
import Commands from "../../structures/Commands";

export default class AddParticipant extends Commands {
    constructor(public client: Bot) {
        super(client);
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

        const { tournament_id } = this.getCommandOptionValues(interaction, ["tournament_id"]);

        try {
            const tournament = await this.challonge.tournament.show(tournament_id, true);

            // Map and extract the user ID inside bracket
            const currrentParticipants = tournament.participants.map(
                participant => participant.name.match(/^\[(.*?)\]\s*(.*)$/)[1]
            );

            if (!currrentParticipants.includes(interaction.user.id)) {
                throw new Error("You are not in the tournament");
            }

            const participantFullName = tournament.participants
                .map(participant => {
                    return { id: participant.id, name: participant.name };
                })
                .find(i => i.name.includes(interaction.user.id));

            await this.challonge.participant.destroy(tournament_id, participantFullName?.id).then(() => {
                interaction.editReply(`<@${interaction.user.id}> left ${tournament.name}`);
            });
        } catch (err) {
            interaction.editReply({ content: `${err}` });
        }
    };
}
