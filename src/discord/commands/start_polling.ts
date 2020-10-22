import { Client, Message } from "discord.js";
import Command from "./common";

export class StartPolling extends Command {
    name = 'start';
    desc = 'Start polling';
    onlyOwners = true;

    execute(client: Client, msg: Message, args: string[]): void {
        console.log(`Command ${this.name} execute`);
        this.bus.emit('start_polling', msg.channel.id, msg.id);
    }
}