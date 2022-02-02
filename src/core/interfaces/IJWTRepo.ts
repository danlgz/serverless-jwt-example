import User from "../../domain/User";

export type SignReturnType = {
  token: string;
  refresh: string;
}

export default interface IJWTGeneratorRepo {
  register(user: User): void;
  sign(): SignReturnType;
}
