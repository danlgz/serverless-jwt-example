import User from "../../domain/User";

export type TokenDataType = {
  token: string;
  refresh: string;
}

export interface IJWTGeneratorRepo {
  register(user: User): void;
  sign(): TokenDataType;
}

export interface IJWTVerifierRepo {
  token: string;
  refresh: string;
  registerToken(token: string): void;
  registerRefresh(refresh: string): void;
  isTokenValid(): boolean;
  isRefreshValid(): boolean;
  refreshToken(): Promise<TokenDataType>;
}
