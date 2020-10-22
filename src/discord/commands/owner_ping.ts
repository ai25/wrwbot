import { Client, Emoji, Message } from "discord.js";
import Command from "./common";

export class Owner_Ping extends Command {
    name = 'oping';
    desc = 'Ping the bot, only for owners';
    onlyOwners = true;

    execute(client: Client, msg: Message, args: string[]): void {
        console.log(`Command ${this.name} execute`);
        msg.reply("Owner Pong");
    }
}