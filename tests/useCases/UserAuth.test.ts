import { JWTConfiguration } from "../../src/core/common/jwt";
import { JWTGeneratorRepo } from "../../src/repository/JWTRepo";
import { UserRepo } from "../../src/repository/UserRepo";
import { userAuthentication } from "../../src/useCases/UserAuth";


describe('User auth', () => {
  it('user auth failed', async () => {
    const userRepo = new UserRepo();
    const jwtGeneratorRepo = new JWTGeneratorRepo();

    const authUseCase = userAuthentication(userRepo, jwtGeneratorRepo);
    await expect(authUseCase('', '')).rejects.toThrow('user does not exists');
  });

  it('user auth succesfuly', async () => {
    const userRepo = new UserRepo();
    const jwtGeneratorRepo = new JWTGeneratorRepo();

    const authUseCase = userAuthentication(userRepo, jwtGeneratorRepo);
    const { publicUser, token, refresh } = await authUseCase('marshmccall@ultrimax.com', 'root');

    expect(refresh).toMatch(JWTConfiguration.pattern);
    expect(token).toMatch(JWTConfiguration.pattern);
    expect(publicUser.username).toBe('marshmccall@ultrimax.com');
  });
});
