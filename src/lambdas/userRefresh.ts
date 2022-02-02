import { Handler, APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";
import { TokenDataType } from "../core/interfaces/IJWTRepo";
import { internalServerErrorResponse, notAcceptableResponse, successfulResponse, unauthorizedResponse } from "../core/lambdas/responseHelper";
import { JWTVerifierRepo } from "../repository/JWTRepo";
import { UserRepo } from "../repository/UserRepo";
import { userRefresh } from "../useCases/UserAuth";

export const handler: Handler = async ({ body = '' }: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  if (body === null || body === '') return notAcceptableResponse('body is empty');

  const { refresh } = JSON.parse(body);
  if (!refresh) return notAcceptableResponse('refresh token is required');

  const userRepo = new UserRepo();
  const jwtVerifierRepo = new JWTVerifierRepo(userRepo);

  const refreshUseCase = userRefresh(jwtVerifierRepo);
  let tokens: TokenDataType;
  try {
    tokens = await refreshUseCase(refresh);
  } catch(err) {
    err = err.message
    if (err === 'invalid refresh token') return unauthorizedResponse(err)
    return internalServerErrorResponse(err);
  }

  return successfulResponse(tokens);
}
