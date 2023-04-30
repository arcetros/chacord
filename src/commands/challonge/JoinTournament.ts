import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import Bot from "../../structures/Bot";
import Commands from "../../structures/Commands";

export default class AddParticipant extends Commands {
    constructor(public client: Bot) {
        super(client);
    }
    name = "join";
    visible = true;
    description = "Join a tournament";
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

            if (tournament.description.split(",")[1] === "true") {
                throw new Error("This tournament is private, you need to ask the owner to join");
            }

            // Map and extract the user ID inside bracket
            const currrentParticipants = tournament.participants.map(
                participant => participant.name.match(/^\[(.*?)\]\s*(.*)$/)[1]
            );

            if (currrentParticipants.includes(interaction.user.id)) {
                throw new Error("You are already joined this tournament");
            }

            await this.challonge.participant
                .create(tournament_id, {
                    participant: {
                        name: `[${interaction.user.id}] - ${interaction.user.username}`
                    }
                })
                .then(() => {
                    interaction.editReply(`<@${interaction.user.id}> sucessfully joined ${tournament.name}`);
                });
        } catch (err) {
            interaction.editReply({ content: `${err}` });
        }
    };
}
