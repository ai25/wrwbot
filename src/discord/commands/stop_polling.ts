import { Client, Message } from "discord.js";
import Command from "./common";

export class StopPolling extends Command {
    name = 'stop';
    desc = 'Stop polling';
    onlyOwners = true;

    execute(client: Client, msg: Message, args: string[]): void {
        console.log(`Command ${this.name} execute`);
        this.bus.emit('stop_polling', msg.channel.id, msg.id);
    }
}