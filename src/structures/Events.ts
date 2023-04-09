import { ClientEvents } from "discord.js";
import { Event } from "../typings";
import Bot from "./Bot";

export default abstract class Events implements Event {
    public readonly name: keyof ClientEvents;
    public runOnce: boolean;
    public abstract run(...args: any): any;

    constructor(public client: Bot, name: keyof ClientEvents, runOnce = false) {
        this.name = name;
        this.runOnce = runOnce;
    }
}
