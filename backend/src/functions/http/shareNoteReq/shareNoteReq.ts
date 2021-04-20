import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { noteLogic } from '@businessLogic/NoteLogic';
import { getUserId } from '@libs/utils';
import { noteInit } from '@models/note';
import {createLogger} from "@libs/logger"

const logger = createLogger('postNoteReq');

export const api: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const ownerUserId = getUserId(event);

  logger.info("Note input: " + event.body);
  const body = JSON.parse(event.body);

  try{
    const res = await new noteLogic().shareNote(ownerUserId, body.noteId, body.email);
    return formatJSONResponse(200,  {
      message: res
    });
  }
  catch(err)
  {
    return formatJSONResponse(200, {
      message: { Error: `${err}` }
    });
  }
}

export const main = middyfy(api);
