import { Collection } from "discord.js";
import { join } from "path";
import { Command } from "../../typings";
import { recursiveWalkDir } from "../recursive-walk-dir";

export class CommandsLoader extends Collection<string, Command> {
    public constructor() {
        super();
    }

    private async loadCallback(currentDir: string, file: string) {
        if (!(file.endsWith(".ts") || file.endsWith(".js"))) return;
        const FoundCommand = (await import(join(currentDir, file))).default;
        const command = new FoundCommand() as Command;

        if (!command.data) {
            console.warn(`The command ${join(currentDir, file)} doesn't have a name`);
            return;
        }

        if (!command.execute) {
            console.warn(`The command ${join(currentDir, file)} doesn't have a executable function`);
            return;
        }
        this.set(command.data.name, command);
    }

    public async loadCommands(dir: string): Promise<void> {
        await recursiveWalkDir(join(__dirname, dir), this.loadCallback.bind(this), "Error while loading commands: ");
    }
}
