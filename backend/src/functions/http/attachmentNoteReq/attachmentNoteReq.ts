import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda';
import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { noteLogic } from '@businessLogic/NoteLogic';
import { getUserId } from '@libs/utils';
import {createLogger} from "@libs/logger"

const logger = createLogger('postNoteReq');

export const api: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const user = getUserId(event);
  const {noteId} = event.pathParameters;

  try{

    logger.info(`Attchment for NoteId ${noteId}`);
    const url = await new noteLogic().getUrlAttachment(user, noteId);

    return formatJSONResponse(200,  {
      message: {preSignedUrl: url}
    });
  }
  catch(err){

    return formatJSONResponse(502,  {
      message: `${err}` 
    });
  }
}

export const main = middyfy(api);
