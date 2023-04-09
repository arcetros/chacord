import { join } from "path";
import Bot from "../../structures/Bot";
import { Event } from "../../typings";
import { recursiveWalkDir } from "../recursive-walk-dir";

export class EventsLoader {
    constructor(public client: Bot) {}
    private async loadCallback(currentDir: string, file: string) {
        if (!(file.endsWith(".ts") || file.endsWith(".js"))) return;
        const FoundEvent = (await import(join(currentDir, file))).default;
        const { name, run, runOnce } = new FoundEvent(this.client) as Event;

        if (!name) {
            console.warn(`The event ${join(currentDir, file)} doesn't have a name!`);
            return;
        }

        if (!run) {
            console.warn(`The event ${name} doesn't have an executable function!`);
            return;
        }

        if (runOnce) {
            this.client.once(name, run.bind(null, this.client));
            return;
        }

        this.client.on(name, (...args) => {
            run(this.client, ...args.flat(2));
        });
    }

    public async loadEvents(dir: string): Promise<void> {
        await recursiveWalkDir(join(__dirname, dir), this.loadCallback.bind(this), "Error while loading events: ");
    }
}
