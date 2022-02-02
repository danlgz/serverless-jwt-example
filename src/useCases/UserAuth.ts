import { IJWTGeneratorRepo, IJWTVerifierRepo, TokenDataType } from "../core/interfaces/IJWTRepo";
import IUserRepo from "../core/interfaces/IUserRepo";
import User, { PublicUserType } from "../domain/User";

type userAuthenticationReturnType = {
  publicUser: PublicUserType;
  token: string;
  refresh: string;
};

export const userAuthentication = (userRepo: IUserRepo, jwtGeneratorRepo: IJWTGeneratorRepo) => async (username: string, password: string): Promise<userAuthenticationReturnType> => {
  const user = await userRepo.getByUsernameAndPassword(username, password);
  jwtGeneratorRepo.register(user);

  const tokens = jwtGeneratorRepo.sign();
  const resposne = {
    publicUser: user.publicUser(),
    ...tokens,
  };

  return resposne;
}


export const userRefresh = (jwtVerifierRepo: IJWTVerifierRepo) => async (refresh: string): Promise<TokenDataType> => {
  jwtVerifierRepo.registerRefresh(refresh);
  const tokens = await jwtVerifierRepo.refreshToken();

  return tokens;
}
