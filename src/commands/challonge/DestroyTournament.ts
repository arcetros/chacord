import Commands from "../../structures/Commands";
import Challonge from "../../api/Client";
import Bot from "../../structures/Bot";
import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";

export default class DestroyTournament extends Commands {
    public challonge: Challonge;
    constructor(public client: Bot) {
        super(client);
        this.challonge = new Challonge({ api_key: process.env.CHALLONGE_API_KEY as string });
    }
    name = "tdestroy";
    visible = true;
    description = "Delete a tournament";
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
                .setName("tournament_id")
                .setDescription("The ID of the tournament to process the action")
                .setRequired(true)
        );
    execute = async (interaction: CommandInteraction<CacheType>): Promise<void> => {
        const tournament_id = interaction.options.get("tournament_id")?.value as string;
        try {
            const response = await this.challonge.tournament.destroy(tournament_id);
            interaction.reply({ content: `${response.name} is successfully destroyed` });
        } catch (err) {
            interaction.reply({ content: `${err}` });
        }
    };
}
