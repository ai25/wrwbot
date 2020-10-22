import * as PouchDB from 'pouchdb';
import { Post } from '../data';
import { IPostDAO } from '../store';
import PouchdbFind from 'pouchdb-find';

export class PouchDBImpl implements IPostDAO {

    private readonly dirpath: string = './db';
    private readonly filename: string = 'posts';
    private readonly filepath: string = `${this.dirpath}/${this.filename}`;

    private readonly db: PouchDB.Database<Post>;

    constructor() {
        PouchDB.plugin(PouchdbFind);
        this.db = new PouchDB.default(this.filepath);
    }

    public async loadAll(): Promise<Post[]> {
        let docs = await this.db.allDocs({
            include_docs: true,
            attachments: true,
        });

        return docs.rows.map(x => x.doc as Post);
    }

    async save(...post: Post[]): Promise<void> {
        await this.db.bulkDocs(post);
    }

    async load(...id: Number[]): Promise<Post[]> {
        let f = await this.db.find({
            selector: {
                _id: { $in: id.map(x => x.toString()) }
            },
            sort: ['_id'],
        });
        return f.docs as Post[]
    }

    async loadLast(last: Number): Promise<Post[]> {
        const docs = await this.db.allDocs({
            include_docs: true,
            attachments: true,
            limit: last as number,
            descending: true,
        });
        return docs.rows.map(v => v.doc as Post)
    }
    async contain(id: Number): Promise<boolean> {
        try {
            const d = await this.db.get(id.toString(), {
                attachments: false,
            });
            return true;
        } catch (e) {
            return false;
        }
    }

    async getIfContain(ids: String[]): Promise<Post[]> {
        const f = await this.db.find({
            selector: { _id: { $in: ids } },
            sort: ['_id']
        });

        return f.docs as Post[];
    }

    async count(): Promise<Number> {
        let i = await this.db.info();
        return i.doc_count;
    }

    async delete(id: String): Promise<boolean> {
        try {
            const post = await this.db.get(id as string);
            await this.db.remove(post);
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}