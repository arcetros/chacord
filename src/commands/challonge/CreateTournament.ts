import { CommandInteraction, SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import moment from "moment";
import Bot from "../../structures/Bot";
import Commands from "../../structures/Commands";

export default class CreateTournament extends Commands {
    constructor(public client: Bot) {
        super(client);
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
        )
        .addStringOption(option =>
            option
                .setName("is_private")
                .setDescription("true is private, false is not (everyone can join)")
                .setRequired(false)
                .addChoices(
                    {
                        value: "true",
                        name: "true"
                    },
                    { name: "false", value: "false" }
                )
        );
    execute = async (interaction: CommandInteraction): Promise<void> => {
        await interaction.deferReply();

        const options = this.getCommandOptionValues(interaction, [
            "tournament_name",
            "tournament_id",
            "tournament_date",
            "is_private"
        ]);
        const dateTime = moment(options.tournament_date, "YYYY/MM/DD HH:mm:ss").toDate();

        try {
            await this.checkTournamentManager(interaction);
            const response = await this.challonge.tournament.create({
                tournament: {
                    name: options.tournament_name,
                    tournamentType: "single elimination",
                    description: `${interaction.user.id}, ${options.is_private === "true"}`,
                    url: options.tournament_id,
                    startAt: dateTime
                }
            });

            interaction.editReply({
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
            interaction.editReply({
                content: `${error}`
            });
        }
    };
}
