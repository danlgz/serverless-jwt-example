import { Handler, APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { genericResponse, internalServerErrorResponse, notAcceptableResponse, successfulResponse, unauthorizedResponse } from "../core/lambdas/responseHelper";
import { JWTGeneratorRepo } from "../repository/JWTRepo";
import { UserRepo } from "../repository/UserRepo";
import { userAuthentication } from "../useCases/UserAuth";

export const handler: Handler = async ({ body = '' }: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  if (body === null || body === '') return notAcceptableResponse('body is empty');

  const { username, password } = JSON.parse(body);
  if (!username || !password) return notAcceptableResponse('username and password are required');

  const userRepo = new UserRepo();
  const jwtRepo = new JWTGeneratorRepo();

  const authFunc = userAuthentication(userRepo, jwtRepo);
  let userAuthenticated: any;
  try {
    userAuthenticated = await authFunc(username, password);
  } catch (err) {
    err = err.message
    if (err === 'user does not exists') return unauthorizedResponse(err)
    return internalServerErrorResponse(err);
  }

  return successfulResponse(userAuthenticated);
}
