import { Client, Message } from "discord.js";
import Command from "./common";

export class Once extends Command {
    name = 'once';
    desc = 'Fetch posts and send it to env channel once';
    onlyOwners = true;

    execute(client: Client, msg: Message, args: string[]): void {
        console.log(`Command ${this.name} execute`);
        msg.react('👌');

        const limit: Number | undefined = (() => {
            if (args.length != 1) return undefined;
            const limit = Number(args[0]);
            return limit == NaN ? undefined : limit;
        })();

        this.bus.emit('once', limit);
    }
}