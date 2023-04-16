import { CommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { ITournament } from "../../typings";
import Challonge from "../../api/Client";
import Commands from "../../structures/Commands";
import Bot from "../../structures/Bot";

export default class GetTournamentInfo extends Commands {
    public challonge: Challonge;
    constructor(public client: Bot) {
        super(client);
        this.challonge = new Challonge({ api_key: process.env.CHALLONGE_API_KEY as string });
    }
    name = "tinfo";
    visible = true;
    description = "View important detail about a tournament";
    information = this.description;
    aliases = [];
    args = false;
    usage = "[tournament name]";
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
        const tournament_id = interaction.options.get("tournament_id")?.value as string;
        try {
            const response = await this.challonge.tournament.show(tournament_id, true);

            const startDate = response.start_at ? new Date(response.start_at).toLocaleString() : null;

            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `Challonge Bot`,
                    url: "https://github.com/arcetros/chacord",
                    iconURL: "https://raw.githubusercontent.com/arcetros/chacord/main/assets/challonge_icon.png"
                })
                .setTitle(`${response.name} - [ID: ${tournament_id}]`)
                .setURL(response.full_challonge_url)
                .addFields(
                    {
                        name: "Start Time",
                        value: startDate ? startDate : "Unknown"
                    },
                    {
                        name: "Current Participants",
                        value: `${response.participants_count} Players`,
                        inline: true
                    },
                    {
                        name: "Max Participants",
                        value: `${response.signup_cap ? response.signup_cap : "∞"} Players`,
                        inline: true
                    },
                    {
                        name: "Participants",
                        value:
                            response.participants.length > 0
                                ? response.participants.map(participant => `> ${participant.name}`).join("\n")
                                : "No participants yet"
                    }
                )
                .setColor("#ed9645")
                .setFooter({
                    text: `STATUS: ${this.getEmojiForState(response.state)}`
                });

            interaction.reply({ embeds: [embed] });
        } catch (err) {
            interaction.reply({ content: `${err}` });
        }
    };

    private getEmojiForState(state: ITournament["state"]): string {
        switch (state) {
            case "pending":
                return "⏰ Pending"; // hourglass emoji
            case "underway":
                return "▶️ In progress"; // fire emoji
            case "awaiting_review":
                return "🤔 Waiting for reviews"; // thinking face emoji
            case "complete":
                return "✅ Complete"; // party popper emoji
            default:
                return "❌ State is unknown";
        }
    }
}
