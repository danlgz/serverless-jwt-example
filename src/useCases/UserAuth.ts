import { IJWTGeneratorRepo, IJWTVerifierRepo, TokenDataType } from "../core/interfaces/IJWTRepo";
import IUserRepo from "../core/interfaces/IUserRepo";
import User, { PublicUserType } from "../domain/User";

type userAuthenticationReturnType = {
  publicUser: PublicUserType;
  token: string;
  refresh: string;
};

export const userAuthentication = (userRepo: IUserRepo, jwtGeneratorRepo: IJWTGeneratorRepo) => async (username: string, password: string): Promise<userAuthenticationReturnType> => {
  let user: User;
  try {
    user = await userRepo.getByUsernameAndPassword(username, password);
  } catch(err) {
    if (err instanceof Error) throw err
    throw new Error(err)
  }

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

  let tokens: TokenDataType;
  try {
    tokens = await jwtVerifierRepo.refreshToken();
  } catch(err) {
    if (err instanceof Error) throw err
    throw new Error(err)
  }

  return tokens;
}
