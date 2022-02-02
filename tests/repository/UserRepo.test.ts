import User from "../../src/domain/User";
import { UserRepo } from "../../src/repository/UserRepo";

const hardcordeUsers = [
  {
    "id": "da42374d-71e0-4fde-8cb8-30ba93f780d1",
    "picture": "http://placehold.it/32x32",
    "password": "root",
    "username": "birdramsey@nimon.com"
  },
  {
    "id": "125e68b4-c9fa-49f4-8f49-853af43ce01a",
    "picture": "http://placehold.it/32x32",
    "password": "root",
    "username": "lillianburgess@luxuria.com"
  },
  {
    "id": "d544a607-df6c-4535-858a-5ffbdba6257c",
    "picture": "http://placehold.it/32x32",
    "password": "root",
    "username": "kristiecole@quadeebo.com"
  },
  {
    "id": "b3d37643-9547-4968-b0b3-c61e5aef1e58",
    "picture": "http://placehold.it/32x32",
    "password": "root",
    "username": "leonorcross@gronk.com"
  },
  {
    "id": "c4901101-8ab4-41a1-a309-dc7ae92494cc",
    "picture": "http://placehold.it/32x32",
    "password": "root",
    "username": "marshmccall@ultrimax.com"
  }
];

const hardcordeObjUsers = hardcordeUsers.map(o => new User(o.id, o.username, o.password, o.picture));

describe('User repository', () => {
  it('fetch records', async () => {
    const repo = new UserRepo();
    const users = await repo.fetch();

    expect(hardcordeUsers).toEqual(users)
  });

  it('list records', async () => {
    const repo = new UserRepo();
    const users = await repo.list();

    expect(users).toEqual(hardcordeObjUsers);
  });

  it('get user by username and password', async () => {
    const repo = new UserRepo();
    const user = await repo.getByUsernameAndPassword('marshmccall@ultrimax.com', 'root');

    expect(user.username).toBe('marshmccall@ultrimax.com');
    expect(user.password).toBe('root');
  });

  it('get user by username and password exception', async () => {
    const repo = new UserRepo();

    await expect(repo.getByUsernameAndPassword('', '')).rejects.toThrow('user does not exists');
  });

  it('get user by id', async () => {
    const repo = new UserRepo();
    const user = await repo.getById('c4901101-8ab4-41a1-a309-dc7ae92494cc');

    expect(user.id).toBe('c4901101-8ab4-41a1-a309-dc7ae92494cc');
  });

  it('get user by exceptioni', async () => {
    const repo = new UserRepo();

    await expect(repo.getById('')).rejects.toThrow('user does not exists');
  });
});
