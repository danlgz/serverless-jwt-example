import User from "../../domain/User";

export default interface IUserRepo {
  fetch(): Promise<Array<any>>;
  list(): Promise<Array<User>>;
  getByUsernameAndPassword(username: string, password: string): Promise<User>;
}