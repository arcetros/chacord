import { ClientEvents } from "discord.js";
import { Event } from "../typings";
import Bot from "./Bot";

export default abstract class Events implements Event {
    public abstract run(...args: any): any;

    constructor(public client: Bot, public name: keyof ClientEvents, public runOnce: boolean) {}
}
