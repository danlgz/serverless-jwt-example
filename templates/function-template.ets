import { Handler, APIGatewayProxyEvent, Context, APIGatewayProxyResult } from "aws-lambda";

export const <%= handlerFunction %>: Handler = async (event: APIGatewayProxyEvent, context: Context): Promise<APIGatewayProxyResult> => {
  const response = {
    statusCode: 200,
    body: JSON.stringify('hello <%= handlerFunction %>!'),
    context
  };

  return response;
}
