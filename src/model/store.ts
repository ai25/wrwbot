import { readDOM, readDOMByURL } from "../parse/parse";
import { NotImplemented, parseToPosts } from "../utils";
import { Post } from "./data";
import { BASE_URL, BASE_POST_URL } from './consts';

export class PostStore {

    // TODO: re-implement cache
    //  updateDB
    //  getNewPostsAndUpdateDB

    // IDs of posts
    private cachedIDs: Number[] = [];
    private cacheSize: Number = 5;
    
    constructor(private readonly dao: IPostDAO) {
        this.getLastIDs(this.cacheSize).then(x => this.cachedIDs = x);
    }

    public async getNewPostsAndUpdateDB(): Promise<Post[]> {
        const posts = await this.getNewPosts();
        await this.updateDB(...posts);
        return posts;
    }

    public async getNewPosts(): Promise<Post[]> {
        const posts = await this.fetchAndParseNewPosts();
        const exists: Post[] = await this.dao.getIfContain(posts.map(x => x._id))
        const newPosts: Post[] = this.diffPosts(posts, exists);

        console.log(`fetched posts: ${posts.map(p => p._id)}`);
        console.log(`exists posts: ${exists.map(p => p._id)}`);
        console.log(`newPosts posts: ${newPosts.map(p => p._id)}`);
        
        return newPosts;
    }

    private diffPosts(p1: Post[], p2: Post[]): Post[] {
        const ids: String[] = p2.map(x => x._id);
        return p1.filter(x => !ids.includes(x._id));
    }

    private async fetchAndParseNewPosts(): Promise<Post[]> {
        const dom = await readDOM(false);
        const posts = parseToPosts(dom.window.document);
        return posts;
    }

    // save new posts to db
    public async updateDB(...posts: Post[]) {
        this.dao.save(...posts);
        this.cachedIDs = await this.getLastIDs(this.cacheSize);
    }

    public async getPostByID(id: Number): Promise<Post[]> {
        let posts = await this.dao.load(id);
        if (posts.length == 0) {
            const dom = await readDOMByURL(`${BASE_URL}?before=${id as number + 1}`);
            posts = parseToPosts(dom.window.document).filter(p => p.post_id == id);
            this.updateDB(...posts);
        }
        return posts;
    }

    // Gets last 5 ids of posts
    private async getLastIDs(cacheSize: Number): Promise<Number[]> {
        let posts = await this.dao.loadLast(cacheSize)
        posts.forEach((post) => {
            this.cachedIDs.push(post.post_id);
        });

        return this.cachedIDs;
    }

    // by post or ID
    async contain(post: Post | Number): Promise<boolean> {
        if (post instanceof Number) {
            return await this.dao.contain(post);
        } else {
            let id = post.post_id
            return await this.dao.contain(id);
        }
    }

}

export interface IPostDAO {
    save(...post: Post[]): void;

    load(...id: Number[]): Promise<Post[]>;

    loadLast(last: Number): Promise<Post[]>;

    loadAll(): Promise<Post[]>;

    contain(id: Number): Promise<boolean>;

    getIfContain(ids: String[]): Promise<Post[]>;

    count(): Promise<Number>;
}