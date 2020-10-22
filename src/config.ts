import dotenv from 'dotenv';
// .env file
dotenv.config()

export class Config {
    private readonly default_interval: number = 10000;
    private readonly min_interval: number = 1000;

    readonly token: string;
    readonly prefix: string;
    readonly owner_ids: string[];
    readonly channel_id: string;
    readonly polling_autostart: boolean;
    readonly polling_interval: number;

    constructor() {
        if (!process.env.TOKENBOT) {
            throw new Error(`TOKEN is undefined! Check the '.env' file.`)
        }

        if (!process.env.POSTCHANNEL) {
            throw new Error(`POSTCHANNEL is undefined! Check the '.env' file.`)
        }

        this.token = process.env.TOKENBOT;
        this.prefix = process.env.BOTPREFIX || "!";
        this.owner_ids = this.fetchOwners(process.env.BOTOWNERS);
        this.channel_id = process.env.POSTCHANNEL;
        this.polling_autostart = process.env.POLLING_AUTOSTART == "true";
        this.polling_interval = (()=>{
            if (process.env.POLLING_INTERVAL == undefined) return this.default_interval;
            let interval = parseInt(process.env.POLLING_INTERVAL);
            if (isNaN(interval)) return this.default_interval;
            return Math.max(interval, this.min_interval);
        })();
        
        console.log('Bot token check: ok');
        console.log(`Bot Prefix: ${this.prefix}`);
        console.log(`Bot Owners: ${this.owner_ids}`);
        console.log(`Bot channel id: ${this.channel_id}`);
        console.log(`Autostart: ${this.polling_autostart}`);
        console.log(`Polling Interval: ${this.polling_interval}`);
    }

    private fetchOwners(env_porowners: string | undefined): string[] {
        let owners: string[] = (env_porowners ?? new String).split(",").map(x => x.trim());
        return owners;
    }

    public test_fetchOwners(env_porowners: string | undefined): string[] {
        let str_owners: string = (env_porowners ?? "")
        if (str_owners.length == 0 || str_owners == "") {
            return [];
        } else {
            return str_owners.split(",").map(x => x.trim());
        }
    }
}

const config = new Config();

export default config;

export const DEBUG = (process.env.SETDEBUG ?? "false") === 'true';
