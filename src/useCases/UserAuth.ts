import IJWTGeneratorRepo from "../core/interfaces/IJWTRepo";
import IUserRepo from "../core/interfaces/IUserRepo";
import User, { PublicUserType } from "../domain/User";

export const userAuthentication = (userRepo: IUserRepo, jwtGeneratorRepo: IJWTGeneratorRepo) => async (username: string, password: string): Promise<{
  publicUser: PublicUserType;
  token: string;
  refresh: string;
}> => {
  let user: User;
  try {
    user = await userRepo.getByUsernameAndPassword(username, password);
  } catch(err) {
    if (err instanceof Error) throw err
    throw new Error(err)
  }

  jwtGeneratorRepo.register(user);
  const { token, refresh } = jwtGeneratorRepo.sign();
  const resposne = {
    publicUser: user.publicUser(),
    token,
    refresh,
  };

  return resposne;
}
