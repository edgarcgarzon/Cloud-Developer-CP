import 'source-map-support/register';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

const api: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const {name} = JSON.parse(event.body);
  
  return formatJSONResponse(200, {
    message: `Hello ${name} welcome to the exciting Serverless world!`,
    event,
  });
}

export const main = middyfy(api);
