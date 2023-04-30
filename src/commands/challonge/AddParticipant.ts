import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import Bot from "../../structures/Bot";
import Commands from "../../structures/Commands";

export default class AddParticipant extends Commands {
    constructor(public client: Bot) {
        super(client);
    }
    name = "addp";
    visible = true;
    description = "Add a participant to a tournament (up until it is started).";
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
            option.setName("tournament_id").setDescription("Tournament ID (must be yours)").setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("participant_name")
                .setDescription("The name displayed in the bracket/schedule")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("seed")
                .setDescription("The participant's new seed. Must be between 1 and the current number of participants")
                .setRequired(false)
        );
    execute = async (interaction: CommandInteraction): Promise<void> => {
        await interaction.deferReply();

        const { tournament_id, participant_name, seed } = this.getCommandOptionValues(interaction, [
            "tournament_id",
            "participant_name",
            "seed"
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

            if (seed && isNaN(Number(seed))) {
                throw new Error("Seed is not a number");
            }

            if (currrentParticipants.includes(userId)) {
                throw new Error(`<@${userId}> is already on the bracket`);
            }

            const guild = this.client.guilds.cache.get(interaction.guildId!);
            const targetUser = await guild?.members.fetch(userId);

            await this.challonge.participant
                .create(tournament_id, {
                    participant: {
                        name: `[${userId}] - ${targetUser?.user.username}`,
                        seed: Number(seed)
                    }
                })
                .then(() => {
                    interaction.editReply({ content: `<@${userId}> added to ${tournament.name} tournament bracket` });
                });
        } catch (err) {
            interaction.editReply({ content: `${err}` });
        }
    };
}
