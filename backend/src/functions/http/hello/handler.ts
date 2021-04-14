import 'source-map-support/register';

import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/apiGateway';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import {holaSchema} from './holaSchema';

const api: ValidatedEventAPIGatewayProxyEvent<typeof holaSchema> = async (event) => {
  return formatJSONResponse(200, {
    message: `Hello ${event.body.name}, welcome to the exciting Serverless world!`,
    event,
  });
}

export const main = middyfy(api);
