import { Client, Message } from "discord.js";
import Command from "./common";

export class EmitPing extends Command {
    name = 'eping';
    desc = 'Ping the bot and emit the event to bus';
    onlyOwners = true;

    execute(client: Client, msg: Message, args: string[]): void {
        console.log(`Command ${this.name} execute`);
        msg.react('👌');
        this.bus.emit('command', {name: this.name, args: args});
    }
}