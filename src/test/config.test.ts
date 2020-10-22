import { Config } from '../config';

test('fetchOwners', () => {
    let cfg = new Config();

    expect(cfg.test_fetchOwners(undefined)).toEqual([]);
    expect(cfg.test_fetchOwners("")).toEqual([]);
    expect(cfg.test_fetchOwners("user_id")).toEqual(["user_id"]);
    expect(cfg.test_fetchOwners("user_id1,user_id2,user_id3,user_id4"))
    .toEqual(["user_id1", "user_id2", "user_id3", "user_id4"]);
    expect(cfg.test_fetchOwners("user_id1, user_id2, user_id3,   user_id4"))
    .toEqual(["user_id1", "user_id2", "user_id3", "user_id4"]);

});