import { CommandInteraction, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import moment from "moment";
import Challonge from "../../api/Client";
import Bot from "../../structures/Bot";
import Commands from "../../structures/Commands";

export default class CreateTournament extends Commands {
    public challonge: Challonge;
    constructor(public client: Bot) {
        super(client);
        this.challonge = new Challonge({ api_key: process.env.CHALLONGE_API_KEY as string });
    }
    name = "tcreate";
    visible = true;
    description = "Create a new tournament";
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
                .setName("tournament_name")
                .setDescription("Your event's name/title (Max: 60 characters)")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("tournament_date")
                .setDescription(
                    "The planned or anticipated start time for the tournament. example: YYYY/MM/DD 14:00:00"
                )
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("tournament_id")
                .setDescription("When blank on create, a random URL will be generated for you")
                .setRequired(false)
        );
    execute = async (interaction: CommandInteraction): Promise<void> => {
        if (!(await this.isTournamentManager(interaction))) {
            interaction.reply({ content: "Insufficent permission" });
            return;
        }

        const tournament_name = interaction.options.get("tournament_name")?.value as string;
        const tournament_id = interaction.options.get("tournament_id")?.value as string;
        const tournament_date = interaction.options.get("tournament_date")!.value as string;

        const dateTime = moment(tournament_date, "YYYY/MM/DD HH:mm:ss").toDate();

        try {
            const response = await this.challonge.tournament.create({
                tournament: {
                    name: tournament_name,
                    tournamentType: "single elimination",
                    description: `${interaction.user.id}`,
                    url: tournament_id,
                    startAt: dateTime
                }
            });

            interaction.reply({
                content: `Succesfully created ${response.name} with id ${"`"}${response.url}${"`"}`,
                components: [
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setLabel("See in browser")
                            .setURL(response.full_challonge_url)
                            .setStyle(ButtonStyle.Link)
                    )
                ]
            });
        } catch (error) {
            interaction.reply({
                content: `${error}`
            });
        }
    };
}
