import { JWTConfiguration } from "../../src/core/common/jwt";
import { JWTGeneratorRepo, JWTVerifierRepo } from "../../src/repository/JWTRepo";
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

describe('JWT verify', () => {
  it('valid tokens', async () => {
    const userRepo = new UserRepo();
    const jwtGeneratorRepo = new JWTGeneratorRepo();
    jwtGeneratorRepo.register(await userRepo.getByUsernameAndPassword('marshmccall@ultrimax.com', 'root'));
    const jwtVerifier = new JWTVerifierRepo(userRepo);

    const { token, refresh } = jwtGeneratorRepo.sign();
    jwtVerifier.registerToken(token);
    jwtVerifier.registerRefresh(refresh);

    expect(jwtVerifier.isTokenValid()).toBeTruthy();
    expect(jwtVerifier.isRefreshValid()).toBeTruthy();
  });

  it('refresh token', async () => {
    const userRepo = new UserRepo();
    const jwtGeneratorRepo = new JWTGeneratorRepo();
    jwtGeneratorRepo.register(await userRepo.getByUsernameAndPassword('marshmccall@ultrimax.com', 'root'));
    const jwtVerifier = new JWTVerifierRepo(userRepo);
    const tokens = jwtGeneratorRepo.sign();
    jwtVerifier.registerRefresh(tokens.refresh);

    const { token, refresh } = await jwtVerifier.refreshToken();

    expect(token).toMatch(JWTConfiguration.pattern);
    expect(refresh).toMatch(JWTConfiguration.pattern);
  });

  it('invalid refresh token type', async () => {
    const userRepo = new UserRepo();
    const jwtGeneratorRepo = new JWTGeneratorRepo();
    jwtGeneratorRepo.register(await userRepo.getByUsernameAndPassword('marshmccall@ultrimax.com', 'root'));
    const jwtVerifier = new JWTVerifierRepo(userRepo);
    const tokens = jwtGeneratorRepo.sign();
    jwtVerifier.registerRefresh(tokens.token);

    await expect(jwtVerifier.refreshToken()).rejects.toThrow('invalid refresh token');
  });

  it('invalid tokens', async () => {
    const userRepo = new UserRepo();
    const jwtVerifier = new JWTVerifierRepo(userRepo);

    jwtVerifier.registerToken('');
    jwtVerifier.registerRefresh('');

    expect(jwtVerifier.isTokenValid()).toBeFalsy();
    expect(jwtVerifier.isRefreshValid()).toBeFalsy();
  });
});
