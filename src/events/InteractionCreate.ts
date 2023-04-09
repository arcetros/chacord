import { Collection, CommandInteraction, Interaction } from "discord.js";
import Bot from "../structures/Bot";
import Events from "../structures/Events";

export default class Ready extends Events {
    constructor(client: Bot) {
        super(client, "interactionCreate", false);
    }

    public runOnce = false;
    public async run(client: Bot, interaction: Interaction) {
        if (!interaction.isChatInputCommand) return;
        if (interaction instanceof CommandInteraction) {
            const command = client.commands.get(interaction.commandName);
            if (!command) return;
            if (!client.cooldowns.has(interaction.commandName)) {
                client.cooldowns.set(interaction.commandName, new Collection());
            }
            const now = Date.now();
            const timestamps: any = client.cooldowns.get(interaction.commandName);
            const cooldownAmount = (command.cooldown || 1) * 1000;
            if (timestamps.has(interaction.user.id)) {
                const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
                if (now < expirationTime) {
                    const timeLeft = (expirationTime - now) / 1000;
                    return interaction.reply({
                        content: `Please wait ${timeLeft.toFixed(1)} more second(s) before using the ${
                            interaction.commandName
                        }`
                    });
                }
            }
            timestamps.set(interaction.user.id, now);
            setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
            command.execute(interaction);
        }
    }
}
