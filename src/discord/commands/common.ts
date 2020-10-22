import * as Discord from 'discord.js';
import config from "../../config";
import { EventBusFromBot } from '../../events/EventBus';

export default abstract class Command {
    abstract readonly name: string;
    readonly desc: string = '';
    readonly onlyOwners: boolean = false;
    readonly guildOnly: boolean = false;
    readonly usePrefix: boolean = true;

    constructor(
        readonly client: Discord.Client,
        protected readonly bus: EventBusFromBot,
    ) { }

    abstract execute(client: Discord.Client, msg: Discord.Message, args: string[]): void;

    isNotOwnerHook(client: Discord.Client, msg: Discord.Message): void {
        msg.react('🚫');
    };
    

    register() {
        this.checkName();
        this.client.on('message', msg => {
            if (!this.commandChecks(msg)) return;

            const args = msg.content.slice(config.prefix.length).trim().split(/ +/);
            const command = args.shift()?.toLowerCase();

            if (command != this.name) return;

            this.runCommand(this.client, msg, args);

        });
        console.log(`Command <${this.name}> has been registered`);
    }

    private runCommand(client: Discord.Client, msg: Discord.Message, args: string[]) {
        this.execute(this.client, msg, args)
    }

    private checkName() {
        if (this.name.length == 0 || this.name == '') {
            throw new Error('Command name is empty!');
        }
    }

    private commandChecks(msg: Discord.Message): boolean {
        if (this.usePrefix && !msg.content.startsWith(config.prefix)) return false;
        if (msg.author.bot) return false;
        if (this.onlyOwners && !this.isOwner(msg)) return false;

        return true;
    }

    private isOwner(msg: Discord.Message): boolean {
        if (config.owner_ids.includes(msg.author.id)) {
            return true;
        } else {
            this.isNotOwnerHook(this.client, msg);
            return false;
        }
    }
}
