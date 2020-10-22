import { Client, Message } from "discord.js";
import Command from "./common";

export class FetchPost extends Command {
    name = 'fetch';
    desc = 'FetchPost by post_id and send it to env channel once';
    onlyOwners = true;

    execute(client: Client, msg: Message, args: string[]): void {
        console.log(`Command ${this.name} execute`);
        
        if (args.length != 1) {
            msg.react('⚠️');
            msg.reply(`Use 'fetch <post_id>'`);
            return;
        }

        this.bus.emit('fetch_post', args[0], msg.channel.id, msg.id);
    }
}