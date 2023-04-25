import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import Challonge from "../../api/Client";
import Bot from "../../structures/Bot";
import Commands from "../../structures/Commands";

export default class BulkAddParticipants extends Commands {
    public challonge: Challonge;
    constructor(public client: Bot) {
        super(client);
        this.challonge = new Challonge({ api_key: process.env.CHALLONGE_API_KEY as string });
    }
    name = "bulkaddp";
    visible = true;
    description = "Bulk add participants to a tournament (up until it is started).";
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
                .setName("participants")
                .setDescription("Format example: @john/3 (discord user, seed)")
                .setRequired(true)
        );
    execute = async (interaction: CommandInteraction): Promise<void> => {
        await interaction.deferReply();

        const tournament_id = interaction.options.get("tournament_id")?.value as string;
        const participants = interaction.options.get("participants")?.value as string;

        const splitParticipants = participants.split(",");

        const tournament = await this.challonge.tournament.show(tournament_id, true);

        // Map and extract the user ID inside bracket
        if (!(await this.isTournamentManager(interaction))) {
            interaction.editReply({ content: "Insufficient permission" });
            return;
        }

        if (tournament.description !== interaction.user.id) {
            interaction.editReply({ content: "Cant add participant, you are not the owner of this tournament" });
            return;
        }

        const newParticipants = await Promise.all(
            splitParticipants.map(async participant => {
                const [name, seed] = participant.split("/");

                const userId = await this.sanitizeUserId(name, interaction);

                if (typeof userId === "object") {
                    throw new Error(userId.content);
                }

                const guild = this.client.guilds.cache.get(interaction.guildId!);
                const targetUser = await guild?.members.fetch(userId);

                return { name: `[${userId}] - ${targetUser?.user.username}`, seed: seed ? Number(seed) : undefined };
            })
        );

        try {
            await this.challonge.participant
                .bulkAdd(tournament_id, {
                    participants: newParticipants
                })
                .then(() => {
                    interaction.editReply({
                        content: `${newParticipants.length} participants added to ${tournament.name} tournament bracket`
                    });
                });
        } catch (err) {
            interaction.editReply({ content: `${err}` });
        }
    };
}
