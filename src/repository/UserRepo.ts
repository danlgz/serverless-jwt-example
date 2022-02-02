import { promises as fs } from "fs";

import IUserRepo from "../core/interfaces/IUserRepo";
import User from "../domain/User";

export class UserRepo implements IUserRepo {
  static memo: Array<any>;

  fetch(): Promise<Array<any>> {
    return new Promise(async resolve => {
      if (!UserRepo.memo) {
        const data = await fs.readFile('mocks/users.json');
        const result = JSON.parse(data.toString());
        UserRepo.memo = result;
      }

      resolve(UserRepo.memo);
    });
  }

  list(): Promise<Array<User>> {
    return new Promise(async resolve => {
      const data = await this.fetch();
      resolve(data.map(o => new User(o.id, o.username, o.password, o.picture)));
    });
  }

  getByUsernameAndPassword(username: string, password: string): Promise<User> {
    return new Promise(async (resolve, reject) => {
      const users = await this.list();
      const indexResult = users.findIndex(u => u.username === username && u.password === password);
      if (indexResult === -1) {
        reject(new Error('user does not exists'))
        return;
      }

      resolve(users[indexResult]);
    });
  }
}
