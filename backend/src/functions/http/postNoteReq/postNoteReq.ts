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
  logger.info("Note input: " + event.body);

  const notes = await new noteLogic().putNote(userId, body);

  if(!notes){
    formatJSONResponse(505,  {
      message: "messages: Error posting the note"
    });
  }
  
  return formatJSONResponse(200,  {
    message: notes
  });
}

export const main = middyfy(api);
