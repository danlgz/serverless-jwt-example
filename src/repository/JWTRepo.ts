import User from "../domain/User";
import * as jwt from "jsonwebtoken";
import { JWTConfiguration } from "../core/common/jwt";
import { TokenDataType, IJWTGeneratorRepo, IJWTVerifierRepo } from "../core/interfaces/IJWTRepo";
import IUserRepo from "../core/interfaces/IUserRepo";


export type TokenDecodedDataType = {
  id: string;
  username: string;
  type: string;
}

class JWTBase {
  user: User;

  register(user: User): void {
    this.user = user;
  }

  protected generate(expiration: number, type: string): string {
    return jwt.sign(
      {id: this.user.id, username: this.user.username, type},
      JWTConfiguration.secret,
      {expiresIn: expiration}
    )
  }

  protected generateToken(): string {
    return this.generate(JWTConfiguration.expiration, 'token');
  }

  protected generateRefresh(): string {
    return this.generate(JWTConfiguration.refreshExpiration, 'refresh');
  }
}

export class JWTGeneratorRepo extends JWTBase implements IJWTGeneratorRepo {
  sign(): TokenDataType {
    if (!this.user) throw new Error('user not registered');

    const token = this.generateToken();
    const refresh = this.generateRefresh();

    return { token, refresh }
  }
}

export class JWTVerifierRepo extends JWTBase implements IJWTVerifierRepo {
  tokenData: TokenDataType;
  private userRepo: IUserRepo;
  private decodedTokenData: TokenDecodedDataType;
  private decodedRefreshData: TokenDecodedDataType;

  constructor(tokenData: TokenDataType, userRepo: IUserRepo) {
    super();

    this.tokenData = tokenData;
    this.userRepo = userRepo;
  }

  private verify(token: string): TokenDecodedDataType | null {
    try {
      return jwt.verify(token, JWTConfiguration.secret) as TokenDecodedDataType;
    } catch { return null }
  }

  isTokenValid(): boolean {
    const data = this.verify(this.tokenData.token);
    if (data === null) return false;

    this.decodedTokenData = data;
    return true;
  }

  isRefreshValid(): boolean {
    const data = this.verify(this.tokenData.refresh);
    if (data === null) return false;

    this.decodedRefreshData = data;
    return true;
  }

  async refreshToken(): Promise<TokenDataType> {
    const canRefresh = this.isRefreshValid();
    if (!canRefresh) throw new Error('invalid refresh token');

    const user = await this.userRepo.getById(this.decodedRefreshData.id);
    this.register(user);

    this.tokenData = {
      token: this.generateToken(),
      refresh: this.generateRefresh(),
    }

    return this.tokenData;
  }
}
