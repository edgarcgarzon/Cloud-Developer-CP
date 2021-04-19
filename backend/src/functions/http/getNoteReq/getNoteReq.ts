import 'source-map-support/register';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { noteLogic } from '@businessLogic/NoteLogic';
import { getUserId } from '@libs/utils';
import {createLogger} from "@libs/logger"
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';

const logger = createLogger('getNoteReq');

const api: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const userId = getUserId(event);
  const notes = await new noteLogic().getNote(userId);
  
  if(!notes){
    return formatJSONResponse(404,  {
      message: "Error: Not notes for the user can be found"
    });
  }

  return formatJSONResponse(200,  {
    message: notes
  });
}

export const main = middyfy(api);
