import { SlashCommandBuilder, CommandInteraction, Message } from "discord.js";
import { Commands } from "../structures/Commands";

// export default {
//     data: new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!"),
//     cooldown: 10,
//     execute(interaction: CommandInteraction) {
//         interaction.reply({ content: `Pong!` });
//     }
// };

export default class Ping extends Commands {
    name = "ping";
    visible = true;
    description = "Replies with Pong! and response time";
    information = this.description;
    aliases = [];
    args = false;
    usage = "";
    example = "";
    cooldown = 10;
    category = "general";
    guildOnly = false;
    data = new SlashCommandBuilder().setName(this.name).setDescription(this.description);
    execute = (message: Message): Promise<Message> => {
        return message.channel.send(this.ping(message.createdTimestamp));
    };
    executeSlash = async (interaction: CommandInteraction): Promise<void> => {
        await interaction.reply({ content: this.ping(interaction.createdTimestamp) });
    };

    private ping(startTime: number): string {
        const ping = Date.now() - startTime;
        return `Pong! response time: ${ping}ms`;
    }
}
