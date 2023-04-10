import { Collection, CommandInteraction, Interaction, InteractionResponse } from "discord.js";
import Bot from "../structures/Bot";
import Events from "../structures/Events";

export default class InteractionCreate extends Events {
    constructor(client: Bot) {
        super(client, "interactionCreate", false);
    }

    public async run(client: Bot, interaction: Interaction): Promise<InteractionResponse | undefined> {
        if (!interaction.isChatInputCommand) return;
        if (interaction instanceof CommandInteraction) {
            const command = client.commands.get(interaction.commandName);
            if (!command) {
                client.logger.error(`Unknown slash command: ${command}`);
                return;
            }
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
            try {
                command.execute(interaction);
            } catch (e: unknown) {
                await interaction.reply({
                    content: "There was an error while executing this command!",
                    ephemeral: true
                });
                client.logger.error(`An error occured in ${interaction.commandName}: ${(e as Error).message}`);
            }
        }
    }
}
