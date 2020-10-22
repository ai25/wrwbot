import { Emoji } from "discord.js";
import { createNanoEvents, Emitter, Unsubscribe } from "nanoevents";

export class EventBusFromBot {
    emitter: Emitter<EventsFromBot>
    constructor() {
        this.emitter = createNanoEvents<EventsFromBot>();
    }

    public on<K extends keyof EventsFromBot>(this: this, event: K, cb: EventsFromBot[K]): Unsubscribe {
        return this.emitter.on(event, cb);
    }

    public emit<K extends keyof EventsFromBot> (
        this: this,
        event: K,
        ...args: Parameters<EventsFromBot[K]>
      ): void {
        return this.emitter.emit(event, ...args);
    }
}


export interface EventsFromBot {
    command: (ctx: {name: String, args: String[]}) => void,
    oncehere: (channel_id: String, limit: Number | undefined) => void,
    once: (limit: Number | undefined) => void,
    stop_polling: (channel_id: String, message_id: String) => void,
    start_polling: (channel_id: String, message_id: String) => void,
    fetch_post: (post_id: String, channel_id: String, message_id: String) => void,
    // react_message: (channel_id: String, message_id: String, emoji: Emoji) => void,
    test: (msg: String) => void,
}