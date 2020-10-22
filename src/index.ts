import { ABot, Controller } from './controller/ctrl';
import { DiscordBot } from './discord/bot';
import { EventBusFromBot } from './events/EventBus';
import { Post } from './model/data';
import { PouchDBImpl } from './model/db_impls/PouchDBImpl';
import { IPostDAO, PostStore } from './model/store';
import { readDOM } from './parse/parse';
import { parseToPosts } from './utils';


if (!globalThis.fetch) {
    globalThis.fetch = require('node-fetch');;
}

(async () => {
    await run();
})();

async function run() {
    const eb = new EventBusFromBot();
    const bot: ABot = new DiscordBot(eb);
    const dao = new PouchDBImpl();

    const lasts = await dao.loadLast(1);

    // console.log(`deleted: ${lasts.map(p => p._id)}`);
    
    // lasts.forEach(async p => {
    //     await dao.delete(p._id);
    // })

    const store = new PostStore(dao);
    const ctrl = new Controller(store, bot, eb);

    await ctrl.startBot();
}

async function getPosts(): Promise<Post[]> {
    const dom = await readDOM(false);
    return parseToPosts(dom.window.document);
}