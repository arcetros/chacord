import { Collection } from "discord.js";
import { join } from "path";
import Bot from "../../structures/Bot";
import { Command } from "../../typings";
import { recursiveWalkDir } from "../recursive-walk-dir";

export class CommandsLoader extends Collection<string, Command> {
    public constructor(public client: Bot) {
        super();
    }

    private async loadCallback(currentDir: string, file: string) {
        if (!(file.endsWith(".ts") || file.endsWith(".js"))) return;
        const FoundCommand = (await import(join(currentDir, file))).default;
        const command = new FoundCommand() as Command;

        this.client.logger.success(`Loaded command: ${command.data.name}`);
        this.set(command.data.name, command);
    }

    public async loadCommands(dir: string): Promise<void> {
        await recursiveWalkDir(join(__dirname, dir), this.loadCallback.bind(this), "Error while loading commands: ");
    }
}
