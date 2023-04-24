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
        const tournament_id = interaction.options.get("tournament_id")?.value as string;
        const participantName = interaction.options.get("participant_name")?.value as string;
        const seed = interaction.options.get("seed")?.value as string;

        const tournament = await this.challonge.tournament.show(tournament_id, true);

        // Map and extract the user ID inside bracket
        const currrentParticipants = tournament.participants.map(
            participant => participant.name.match(/^\[(.*?)\]\s*(.*)$/)[1]
        );

        if (!(await this.isTournamentManager(interaction))) {
            interaction.reply({ content: "Insufficent permission" });
            return;
        }

        if (tournament.description !== interaction.user.id) {
            interaction.reply({ content: "Cant add participant, you are not the owner of this tournament" });
            return;
        }

        const userId = await this.sanitizeUserId(participantName, interaction);
        if (typeof userId === "object") {
            return;
        }

        if (seed && isNaN(Number(seed))) {
            interaction.reply({ content: "Seed value must be a number" });
            return;
        }

        if (currrentParticipants.includes(userId)) {
            interaction.reply({ content: `<@${userId}> is already on the bracket` });
            return;
        }

        const guild = this.client.guilds.cache.get(interaction.guildId!);
        const targetUser = await guild?.members.fetch(userId);

        try {
            await this.challonge.participant
                .create(tournament_id, {
                    participant: {
                        name: `[${userId}] - ${targetUser?.user.username}`,
                        seed: Number(seed)
                    }
                })
                .then(() => {
                    interaction.reply({ content: `<@${userId}> added to ${tournament.name} tournament bracket` });
                });
        } catch (err) {
            interaction.reply({ content: `${err}` });
        }
    };
}
