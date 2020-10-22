import { NotImplemented } from "../../utils"
import { Post } from "../data"
import { IPostDAO } from "../store"
import * as fs from 'fs';

export class DBJsonImpl implements IPostDAO {

    private readonly dirpath: string = './db';
    private readonly filename: string = 'posts.json';
    private readonly filepath: string = `${this.dirpath}/${this.filename}`;
    // private posts: Post[] = [];

    constructor() {
        this.initDB()
    }
    
    loadAll(): Promise<Post[]> {
        throw new Error("Method not implemented.");
    }
    contain(id: Number): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

    private initDB() {
        if (!fs.existsSync(this.dirpath)) {
            fs.mkdirSync(this.dirpath);
        }

        if (!fs.existsSync(this.filepath)) {
            fs.writeFileSync(this.filepath, '');
        }
        //  else {
        //     let data = fs.readFileSync(this.filepath, 'utf-8');
        //     if (data.length == 0 || data == '') return;
        //     this.posts = JSON.parse(data)
        // }
    }

    async count(): Promise<Number> {
        throw new Error("Method not implemented.")
    }

    save(...post: Post[]) {
        fs.writeFileSync(this.filepath, JSON.stringify(post, null, 2), 'utf-8');
    }
    async load(...id: Number[]): Promise<Post[]> {
        let posts: Post[]= [];
        const data = fs.readFileSync(this.filepath, 'utf-8');

        if (data.length == 0 || data == '') return posts;
        const fetched_posts: Post[] = JSON.parse(data)

        posts = fetched_posts.filter(post => id.includes(post.post_id))
        return posts;
    }
    async loadLast(last: Number): Promise<Post[]> {
        throw NotImplemented()
    }
    
}