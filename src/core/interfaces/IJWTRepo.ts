import User from "../../domain/User";
import { UserRepo } from "../../repository/UserRepo";

export type TokenDataType = {
  token: string;
  refresh: string;
}

export interface IJWTGeneratorRepo {
  register(user: User): void;
  sign(): TokenDataType;
}

export interface IJWTVerifierRepo {
  tokenData: TokenDataType;
  isTokenValid(): boolean;
  isRefreshValid(): boolean;
  refreshToken(): Promise<TokenDataType>;
}
