import { SlashCommandBuilder, CommandInteraction } from "discord.js";

export default {
    data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
    cooldown: 10,
    execute(interaction: CommandInteraction) {
        interaction.reply({ content: `Pong!` });
    }
};
