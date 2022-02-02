// tests for userAuthentication
// Generated by serverless-mocha-plugin
import { getWrapper } from 'serverless-mocha-plugin';
const wrapped = getWrapper('userAuthentication', '/src/lambdas/userAuthentication.ts', 'handler');

describe('failed lambda execution', () => {
  it('empty params: not acceptable', async () => {
    const response = await wrapped.run({});
    expect(response.statusCode).toBe(406);
  });

  it('empty body: not acceptable', async () => {
    const response = await wrapped.run({ body: '{}'});
    expect(response.statusCode).toBe(406);
  });

  it('user does not exists: unauthorized', async () => {
    const response = await wrapped.run({ body: JSON.stringify({ username: 'invalid', password: 'invalid'})});
    expect(response.statusCode).toBe(401);
  });
});

describe('success lambda execution', () => {
  it('authentication: success', async () => {
    const response = await wrapped.run({ body: JSON.stringify({ username: 'marshmccall@ultrimax.com', password: 'root'})});
    expect(response.statusCode).toBe(200);
  });
});
