import { PouchDBImpl } from "../model/db_impls/PouchDBImpl";
import { PostStore } from "../model/store";

test('getNewPosts', async () => {
    const dao = new PouchDBImpl();
    const store = new PostStore(dao);
    await store.getNewPosts();
});