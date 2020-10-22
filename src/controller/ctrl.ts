import { EmojiResolvable } from 'discord.js';
import config from '../config';
import { EventBusFromBot } from '../events/EventBus';
import { Post } from '../model/data';
import { PostStore } from "../model/store";

export class Controller {
    constructor(
        private readonly store: PostStore,
        private readonly bot: ABot,
        private readonly busFromBot: EventBusFromBot,
    ) {
        this.handleBus();
    }
    private botIsStarted: boolean = false;
    private polling_id: NodeJS.Timeout | null = null;


    handleBus() {
        this.busFromBot.on('command', (ctx) => {
            console.log(ctx);
        });

        this.busFromBot.on('oncehere', (channel_id, limit) => {
            this._oncePoll(channel_id, limit);
        });

        this.busFromBot.on('once', (limit) => {
            const channel_id = config.channel_id;
            this._oncePoll(channel_id, limit);
        });

        this.busFromBot.on('stop_polling', (channel_id, message_id) => {
            if (this._stopPolling()) {
                this.bot.reactMessage(channel_id, message_id, '👌');
            } else {
                this.bot.reactMessage(channel_id, message_id, '⚠️');
            }
        });

        this.busFromBot.on('start_polling', (channel_id, message_id) => {
            if (!this.polling_id) {
                this._startPolling();
                this.bot.reactMessage(channel_id, message_id, '👌');
            } else {
                this.bot.reactMessage(channel_id, message_id, '⚠️');
            }
        });

        this.busFromBot.on('fetch_post', async (post_id, channel_id, message_id) => {
            try {
                const posts = await this.store.getPostByID(Number(post_id));
                this.bot.sendPosts(channel_id, posts, undefined);
                this.bot.reactMessage(channel_id, message_id, '👌');
            } catch (err) {
                console.log(err);
                this.bot.reactMessage(channel_id, message_id, '⚠️');
            }

        });
    }

    public startPolling() {
        this.checkBotStarted();
        this._startPolling();
    }

    private _startPolling() {
        const channel_id = config.channel_id;

        const interval_id = setInterval(() => {
            this._oncePoll(channel_id);
        }, config.polling_interval);
        this.polling_id = interval_id;

        // immediately start first poll without interval
        this._oncePoll(channel_id);
    }

    public stopPolling(): boolean {
        this.checkBotStarted();
        return this._stopPolling()
    }

    private _stopPolling(): boolean {
        if (this.polling_id) {
            clearInterval(this.polling_id);
            this.polling_id = null;
            return true;
        } else {
            console.log("Polling is not started");
            const channel_id = config.channel_id;
            this.bot.sendMessage(channel_id, "Polling is not started");
            return false;
        }
    }

    public async oncePoll(channel_id: String, limit: Number | undefined = undefined) {
        this.checkBotStarted();
        this._oncePoll(channel_id, limit);
    }

    private async _oncePoll(channel_id: String, limit: Number | undefined = undefined) {
        const posts = await this.store.getNewPostsAndUpdateDB();
        this.bot.sendPosts(channel_id, posts, limit);
    }

    public async startBot() {
        if (this.botIsStarted) {
            console.log("Bot is already started. Skip.");
            return;
        }
        await this.bot.startBot();
        this.botIsStarted = true;

        if (config.polling_autostart) {
            this._startPolling();
        }
    }

    private checkBotStarted() {
        if (!this.botIsStarted) {
            throw new Error("Bot is not started! First run `Controller#startBot`");
        }
    }
}


export abstract class ABot {

    constructor(
        protected readonly bus: EventBusFromBot,
    ) { }

    abstract startBot(): Promise<String>;
    abstract sendPosts(channel_id: String, posts: Post[], limit: Number | undefined): Promise<void>;
    abstract sendMessage(channel_id: String, msg: String): void;
    abstract reactMessage(channel_id: String, message_id: String, emoji: EmojiResolvable): void;
}
