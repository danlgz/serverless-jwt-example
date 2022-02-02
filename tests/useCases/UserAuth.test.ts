import { JWTConfiguration } from "../../src/core/common/jwt";
import { JWTGeneratorRepo, JWTVerifierRepo } from "../../src/repository/JWTRepo";
import { UserRepo } from "../../src/repository/UserRepo";
import { userAuthentication, userRefresh } from "../../src/useCases/UserAuth";


describe('User auth', () => {
  it('user auth failed', async () => {
    const userRepo = new UserRepo();
    const jwtGeneratorRepo = new JWTGeneratorRepo();

    const authUseCase = userAuthentication(userRepo, jwtGeneratorRepo);
    await expect(authUseCase('', '')).rejects.toThrow('user does not exists');
  });

  it('user auth successfuly', async () => {
    const userRepo = new UserRepo();
    const jwtGeneratorRepo = new JWTGeneratorRepo();

    const authUseCase = userAuthentication(userRepo, jwtGeneratorRepo);
    const { publicUser, token, refresh } = await authUseCase('marshmccall@ultrimax.com', 'root');

    expect(refresh).toMatch(JWTConfiguration.pattern);
    expect(token).toMatch(JWTConfiguration.pattern);
    expect(publicUser.username).toBe('marshmccall@ultrimax.com');
  });

  it('user auth failed', async () => {
    const userRepo = new UserRepo();
    const jwtGeneratorRepo = new JWTGeneratorRepo();

    const authUseCase = userAuthentication(userRepo, jwtGeneratorRepo);
    await expect(authUseCase('', '')).rejects.toThrow('user does not exists');
  });
});

describe('User refresh token', () => {
  it('refresh token successfuly', async () => {
    const userRepo = new UserRepo();
    const jwtGeneratorRepo = new JWTGeneratorRepo();
    const authUseCase = userAuthentication(userRepo, jwtGeneratorRepo);
    const auth = await authUseCase('marshmccall@ultrimax.com', 'root');
    const jwtVerifierRepo = new JWTVerifierRepo(userRepo);

    const refreshUseCase = userRefresh(jwtVerifierRepo);
    const { token, refresh } = await refreshUseCase(auth.refresh);

    expect(token).toMatch(JWTConfiguration.pattern);
    expect(refresh).toMatch(JWTConfiguration.pattern);
  })
});
