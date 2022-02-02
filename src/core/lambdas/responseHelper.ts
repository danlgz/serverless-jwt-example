export const genericResponse = (statusCode: number, body: any) => ({
  statusCode,
  body: JSON.stringify(body),
});

export const successfulResponse = (body: any) => genericResponse(200, body);

export const forbiddenResponse = (error: string) => genericResponse(403, { error });

export const unauthorizedResponse = (error: string) => genericResponse(401, { error });

export const internalServerErrorResponse = (error: string) => genericResponse(500, { error });

export const notAcceptableResponse = (error: string) => genericResponse(406, { error });
