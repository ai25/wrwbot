import * as Discord from 'discord.js';
import config from '../config';
import { ABot } from '../controller/ctrl';
import { EventBusFromBot } from '../events/EventBus';
import { Post } from '../model/data';
import { EmitPing } from './commands/emit_ping';
import { Owner_Ping } from './commands/owner_ping';
import { Ping } from './commands/ping';
import { OnceHere } from './commands/once_here';
import { Once } from './commands/once';
import { StopPolling } from './commands/stop_polling';
import { StartPolling } from './commands/start_polling';
import { FetchPost } from './commands/fetch_post';
import { nexta_logo } from '../model/consts';

export class DiscordBot extends ABot {
    private readonly client: Discord.Client;

    constructor(bus: EventBusFromBot) {
        super(bus);

        this.client = new Discord.Client();
    }

    startBot(): Promise<String> {
        console.log('Init');

        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user?.tag}`);
        });

        this.registerCommands(this.client);

        return this.client.login(config.token)
    }

    async sendPosts(channel_id: String, posts: Post[], limit: number | undefined): Promise<void> {
        const chan = this.client.channels.cache.get(channel_id as string);

        if (!chan) {
            console.log("Error: channel does not exist");
            return;
        }

        if (!(chan instanceof Discord.TextChannel)) {
            console.log("Error: channel is not TextChannel");
            return;
        }

        const len = limit ? Math.min(limit, posts.length) : posts.length;
        console.log(`Sending ${len} posts...`);
        for (let i = 0; i < len; i++) {
            // setTimeout(() => {
            //     this.sendPost(i, chan as Discord.TextChannel, posts[i]);
            // }, 500);
            try {
                console.log(`Sending post ${posts[i]._id} (${i+1})`);
                await this.sendPost(i, chan as Discord.TextChannel, posts[i])
                console.log(`post ${posts[i]._id} (${i+1}) has been sended`);
            } catch (err) {
                console.log(`Cannot send post: ${posts[i]._id}`);
                console.log(err);
            }
        }
    }

    reactMessage(channel_id: String, message_id: String, emoji: Discord.EmojiResolvable): void {
        const chan = this.client.channels.cache.get(channel_id as string);

        if (!chan) {
            console.log("Error: channel does not exist");
            return;
        }

        if (!(chan instanceof Discord.TextChannel)) {
            console.log("Error: channel is not TextChannel");
            return;
        }

        const message = chan.messages.cache.get(message_id as string);
        if (!message) {
            console.log(`Cannot find message with id: ${message_id}`);
            return;
        }

        message.react(emoji);
    }

    private async sendPost(post_ind: number, chan: Discord.TextChannel, post: Post) {
        const [embed, attachments] = this.postToEmbed(post);
        await chan.send(
            embed
        );

        // try to send all attachments
        for (const attach of attachments) {
            try {
                await chan.send(attach)
            } catch (err) {
                console.log(`Cannot send attachment: ${JSON.stringify(attach)}`);
                if (err.code != 40005)
                    console.log(err);
            }
        }
    }

    async sendMessage(channel_id: String, msg: String): Promise<void> {
        const chan = this.client.channels.cache.get(channel_id as string);

        if (!chan) {
            console.log("Error: channel does not exist");
            return;
        }

        if (!(chan instanceof Discord.TextChannel)) {
            console.log("Error: channel is not TextChannel");
            return;
        }

        await chan.send(msg);
    }

    private postToDiscordMessage(post: Post): [String, Discord.MessageAttachment[]] {
        const attachments: Discord.MessageAttachment[] = [];
        const videos: String[] = post.message_videos
            .map(x => {
                let video: String = "";
                if (x.thumb) {
                    // video += x.thumb.toString() + "\n";
                    attachments.push(new Discord.MessageAttachment(x.thumb.toString()))
                }
                if (x.isSupported && x.video_url) {
                    video += x.video_url.toString();
                    // attachments.push(new Discord.MessageAttachment(x.video_url.toString()))
                }

                if (!x.isSupported && x.tgling_to_video) {
                    video += x.tgling_to_video.toString();
                    // attachments.push(new Discord.MessageAttachment(x.tgling_to_video.toString()))
                }
                return video;
            }).filter(x => x.length != 0);


        let msg = `Video: ${videos}`

        console.log(post);
        console.log(videos);
        console.log(attachments);

        return [msg, attachments];
    }

    private postToEmbed(post: Post): [Discord.MessageEmbed, Discord.MessageAttachment[]] {

        const attachments: Discord.MessageAttachment[] = [];
        const attach_photos: Discord.MessageAttachment[] = [];

        const embed = new Discord.MessageEmbed()
            .setURL(post.tgme_link.toString())
            .setFooter('@nexta_tv')
            .setDescription(post.formatted_content)
            .setAuthor(post.tgme_link.toString(), nexta_logo, post.tgme_link.toString())

        if (post.message_photos.length != 0) {
            embed.setImage(post.message_photos[0].toString())
            post.message_photos.slice(1) // skip first
                .forEach(p => {
                    attachments.push(new Discord.MessageAttachment(p.toString(), 'photo.jpeg'))
                    // attach_photos.push(new Discord.MessageAttachment(p.toString()))
                })
        }


        if (post.preview) {
            console.log(post.preview);

            embed.setImage(post.preview.link.toString())
        }

        post.message_videos.forEach(v => {
            let val: string | null;
            let field_name: string = 'video';

            if (v.isSupported) {
                field_name = 'download video';
                val = v.video_url?.toString() ?? null;
            } else {
                field_name = 'tglink to big video';
                val = v.tgling_to_video?.toString() ?? null;
            }

            if (val) {
                embed.addField(
                    field_name,
                    val,
                    true
                )
                attachments.push(new Discord.MessageAttachment(val, `${post._id}_video.mp4`));
            }
        });

        if (attach_photos.length != 0) {
            embed.attachFiles(attach_photos)
        }

        return [embed, attachments];
    }

    private registerCommands(client: Discord.Client) {
        new Ping(client, this.bus).register();
        new Owner_Ping(client, this.bus).register();
        new EmitPing(client, this.bus).register();
        new OnceHere(client, this.bus).register();
        new Once(client, this.bus).register();
        new StopPolling(client, this.bus).register();
        new StartPolling(client, this.bus).register();
        new FetchPost(client, this.bus).register();
    }

}


