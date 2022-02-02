import { JWTConfiguration } from "../../src/core/common/jwt";
import { JWTGeneratorRepo } from "../../src/repository/JWTRepo";
import { UserRepo } from "../../src/repository/UserRepo";


describe('JWT user generator', () => {
  it('user not registered', () => {
    const jwtGeneratorRepo = new JWTGeneratorRepo();
    expect(() => jwtGeneratorRepo.sign()).toThrow('user not registered');
  });

  it('token generation', async () => {
    const userRepo = new UserRepo();
    const jwtGeneratorRepo = new JWTGeneratorRepo();

    jwtGeneratorRepo.register(await userRepo.getByUsernameAndPassword('marshmccall@ultrimax.com', 'root'));
    const { token } = jwtGeneratorRepo.sign();

    expect(token).toMatch(JWTConfiguration.pattern);
  });

  it('refresh token generation', async () => {
    const userRepo = new UserRepo();
    const jwtGeneratorRepo = new JWTGeneratorRepo();

    jwtGeneratorRepo.register(await userRepo.getByUsernameAndPassword('marshmccall@ultrimax.com', 'root'));
    const { refresh } = jwtGeneratorRepo.sign();

    expect(refresh).toMatch(JWTConfiguration.pattern);
  });
});
