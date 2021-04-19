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
  
  const userId = getUserId(event);
  const body:noteInit = JSON.parse(event.body);
  const {noteId} = event.pathParameters;

  logger.info(`Update NoteId ${noteId} with input: ${event.body}`);
  const note = await new noteLogic().updateNote(userId, noteId, body);

  if(!note){
    return formatJSONResponse(502,  {
      message: `Error: updating note ${noteId}`
    });
  }
  
  return formatJSONResponse(200,  {
    message: note
  });
}

export const main = middyfy(api);
