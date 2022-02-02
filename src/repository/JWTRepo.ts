import User from "../domain/User";
import * as jwt from "jsonwebtoken";
import { JWTConfiguration } from "../core/common/jwt";
import IJWTGeneratorRepo, { SignReturnType } from "../core/interfaces/IJWTRepo";

export class JWTGeneratorRepo implements IJWTGeneratorRepo {
  user: User;

  private generate(expiration: number, type: string): string {
    return jwt.sign(
      {id: this.user.id, username: this.user.username, type},
      JWTConfiguration.secret,
      {expiresIn: expiration}
    )
  }

  private token(): string {
    return this.generate(JWTConfiguration.expiration, 'token');
  }

  private refresh(): string {
    return this.generate(JWTConfiguration.refreshExpiration, 'refresh');
  }

  register(user: User): void {
    this.user = user;
  }

  sign(): SignReturnType {
    const token = this.token();
    const refresh = this.refresh();

    return { token, refresh }
  }
}
