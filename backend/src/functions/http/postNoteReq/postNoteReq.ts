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
  
  const user = getUserId(event);
  const body:noteInit = JSON.parse(event.body);
  logger.info("Note input: " + event.body);

  const notes = await new noteLogic().putNote(user, body);

  if(!notes){
    return formatJSONResponse(502,  {
      message: "Error: posting note"
    });
  }
  
  return formatJSONResponse(200,  {
    message: notes
  });
}

export const main = middyfy(api);
