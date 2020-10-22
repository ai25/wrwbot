import { Client, Message } from "discord.js";
import Command from "./common";

export class Ping extends Command {
    name = 'ping';
    desc = 'Ping the bot';

    execute(client: Client, msg: Message, args: string[]): void {
        console.log(`Command ${this.name} execute`);
        msg.reply("Pong");
    }
}